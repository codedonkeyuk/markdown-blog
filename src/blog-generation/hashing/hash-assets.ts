import fs from "fs/promises";
import fsSync from "fs"; // Kept for the synchronous generator
import crypto from "crypto";
import path from "path";
import appConfig from "../../app-config.ts";
import asyncPool from "../thread-management/async-pool.ts";

const {
  productionPath: prodPath,
  siteAddress,
  maxParallelProcesses,
} = appConfig;
const productionPath: string = path.resolve(prodPath);

const ASSET_EXTENSIONS = [
  ".css",
  ".js",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".ico",
  ".woff2",
];
const TEXT_EXTENSIONS = [".html", ".css", ".js", ".xml", ".webmanifest"];

function* walkDir(dir: string): Generator<string> {
  const files = fsSync.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fsSync.statSync(fullPath).isDirectory()) {
      yield* walkDir(fullPath);
    } else {
      yield fullPath;
    }
  }
}

export default async function hashAssets() {
  const assetHashMap = new Map<string, string>();
  const filesToDelete: string[] = [];
  const textFiles: string[] = [];
  const assetsToHash: string[] = [];

  for (const filePath of walkDir(productionPath)) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath).toLowerCase();
    let relativeWebPath =
      "/" + path.relative(productionPath, filePath).replace(/\\/g, "/");

    if (fileName === "sw.js") {
      textFiles.push(filePath);
      continue;
    }
    if (TEXT_EXTENSIONS.includes(ext)) {
      textFiles.push(filePath);
    }
    if (relativeWebPath.toLowerCase().includes("/lib/")) {
      continue;
    }
    if (ASSET_EXTENSIONS.includes(ext) && ext !== ".html" && ext !== ".xml") {
      assetsToHash.push(filePath);
    }
  }

  await asyncPool(assetsToHash, maxParallelProcesses, async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, ext);
    let relativeWebPath =
      "/" + path.relative(productionPath, filePath).replace(/\\/g, "/");

    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto
      .createHash("md5")
      .update(fileBuffer)
      .digest("hex")
      .substring(0, 8);

    const newFileName = `${baseName}.${hash}${ext}`;
    const newFilePath = path.join(dir, newFileName);
    const newRelativeWebPath =
      "/" + path.relative(productionPath, newFilePath).replace(/\\/g, "/");

    await fs.writeFile(newFilePath, fileBuffer);

    assetHashMap.set(relativeWebPath.toLowerCase(), newRelativeWebPath);
    filesToDelete.push(filePath);
  });

  const sortedAssets = Array.from(assetHashMap.keys()).sort(
    (a, b) => b.length - a.length,
  );
  const cleanDomain = siteAddress.replace(/\/$/, "");
  const escapedDomain = cleanDomain.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  await asyncPool(textFiles, 10, async (originalFilePath) => {
    let filePath = originalFilePath;
    let relativeWebPath =
      "/" + path.relative(productionPath, filePath).replace(/\\/g, "/");

    if (assetHashMap.has(relativeWebPath.toLowerCase())) {
      filePath = path.join(
        productionPath,
        assetHashMap.get(relativeWebPath.toLowerCase())!,
      );
    }

    try {
      await fs.access(filePath);
    } catch {
      return;
    }

    let originalContent = await fs.readFile(filePath, "utf8");
    let content = originalContent;

    for (const originalPath of sortedAssets) {
      const hashedPath = assetHashMap.get(originalPath)!;
      const pathFileName = path.basename(originalPath);
      const hashedFileName = path.basename(hashedPath);

      const urlRegex = new RegExp(
        `url\\s*\\(\\s*["']?([^"'\)]+)["']?\\s*\\)`,
        "gi",
      );
      content = content.replace(urlRegex, (match, urlPath) => {
        const cleanUrlPath = urlPath.trim().replace(/\\/g, "/");
        if (
          cleanUrlPath.toLowerCase().endsWith(originalPath.toLowerCase()) ||
          cleanUrlPath.toLowerCase().endsWith(pathFileName.toLowerCase())
        ) {
          const directoryIndex = cleanUrlPath
            .toLowerCase()
            .lastIndexOf(pathFileName.toLowerCase());
          const prefix = urlPath.substring(0, directoryIndex);
          return `url(${prefix}${hashedFileName})`;
        }
        return match;
      });

      const escapedPath = originalPath.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&",
      );
      const standardRegex = new RegExp(
        `(["'\\(\\)=<>\\s]|^)(?:${escapedDomain})?${escapedPath}(["'\\(\\)=<>\\s]|$)`,
        "gi",
      );

      content = content.replace(
        standardRegex,
        (match, openBoundary, closeBoundary) => {
          if (
            (openBoundary === '"' && closeBoundary !== '"') ||
            (openBoundary === "'" && closeBoundary !== "'") ||
            (openBoundary === "(" && closeBoundary !== ")")
          ) {
            return match;
          }

          const hasDomain = match
            .toLowerCase()
            .includes(cleanDomain.toLowerCase());
          const finalPath = hasDomain
            ? `${cleanDomain}${hashedPath}`
            : hashedPath;
          return `${openBoundary}${finalPath}${closeBoundary}`;
        },
      );
    }

    if (content !== originalContent) {
      await fs.writeFile(filePath, content, "utf8");
    }
  });

  await asyncPool(filesToDelete, maxParallelProcesses, async (oldPath) => {
    try {
      await fs.unlink(oldPath);
    } catch {}
  });

  console.log(
    `\x1b[32m✔\x1b[0m Physical cache busting applied to ${assetHashMap.size} dependencies.`,
  );
}
