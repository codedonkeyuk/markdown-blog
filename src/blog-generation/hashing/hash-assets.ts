import fs from "fs";
import crypto from "crypto";
import path from "path";
import appConfig from "../../app-config.ts";

const { productionPath: prodPath, siteAddress } = appConfig();
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
];
const TEXT_EXTENSIONS = [".html", ".css", ".js", ".xml"];

function* walkDir(dir: string): Generator<string> {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
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

  for (const filePath of walkDir(productionPath)) {
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, ext);

    let relativeWebPath =
      "/" + path.relative(productionPath, filePath).replace(/\\/g, "/");

    if (ASSET_EXTENSIONS.includes(ext) && ext !== ".html" && ext !== ".xml") {
      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto
        .createHash("md5")
        .update(fileBuffer)
        .digest("hex")
        .substring(0, 8);

      const newFileName = `${baseName}.${hash}${ext}`;
      const newFilePath = path.join(dir, newFileName);
      const newRelativeWebPath =
        "/" + path.relative(productionPath, newFilePath).replace(/\\/g, "/");

      fs.writeFileSync(newFilePath, fileBuffer);
      assetHashMap.set(relativeWebPath.toLowerCase(), newRelativeWebPath);
      filesToDelete.push(filePath);
    }

    if (TEXT_EXTENSIONS.includes(ext)) {
      textFiles.push(filePath);
    }
  }

  const sortedAssets = Array.from(assetHashMap.keys()).sort(
    (a, b) => b.length - a.length,
  );
  const cleanDomain = siteAddress.replace(/\/$/, "");
  const escapedDomain = cleanDomain.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  for (let i = 0; i < textFiles.length; i++) {
    let filePath = textFiles[i];

    let relativeWebPath =
      "/" + path.relative(productionPath, filePath).replace(/\\/g, "/");
    if (assetHashMap.has(relativeWebPath.toLowerCase())) {
      filePath = path.join(
        productionPath,
        assetHashMap.get(relativeWebPath.toLowerCase())!,
      );
    }

    if (!fs.existsSync(filePath)) continue;

    let originalContent = fs.readFileSync(filePath, "utf8");
    let content = originalContent;

    for (const originalPath of sortedAssets) {
      const hashedPath = assetHashMap.get(originalPath)!;
      const escapedPath = originalPath.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&",
      );

      const regex = new RegExp(
        `(["'\\(\\)])([\\s\\n\\r]*)(?:${escapedDomain})?${escapedPath}([\\s\\n\\r]*)(["'\\(\\)])`,
        "gi",
      );

      content = content.replace(
        regex,
        (match, openBoundary, leadWs, trailWs, closeBoundary) => {
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
          return `${openBoundary}${leadWs}${finalPath}${trailWs}${closeBoundary}`;
        },
      );
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
    }
  }

  for (const oldPath of filesToDelete) {
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  console.log(
    `\x1b[32m✔\x1b[0m Physical cache busting applied to ${assetHashMap.size} dependencies.`,
  );
}
