import * as fs from "fs/promises";
import * as fsSync from "fs"; // Kept for the synchronous directory scanner
import * as path from "path";
import { minify as minifyJS, type MinifyOptions } from "terser";
import * as lightningcss from "lightningcss";
import {
  minify as minifyHTML,
  type Options as HTMLMinifyOptions,
} from "html-minifier-terser";
import appConfig from "../../app-config.ts";
import asyncPool from "../thread-management/async-pool.ts";

const { productionPath, maxParallelProcesses } = appConfig;
const DIST_DIR: string = path.resolve(productionPath);

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fsSync.existsSync(dir)) return results;

  const list = fsSync.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fsSync.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function minifySite(): Promise<void> {
  console.log(`Scanning directory: ${DIST_DIR} ...`);

  const allFiles = getFilesRecursively(DIST_DIR);
  let jsCount = 0;
  let cssCount = 0;
  let htmlCount = 0;

  try {
    await asyncPool(allFiles, maxParallelProcesses, async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      if (ext === ".js") {
        const originalCode = await fs.readFile(filePath, "utf8");
        const jsOptions: MinifyOptions = { mangle: true, compress: true };
        const jsResult = await minifyJS(originalCode, jsOptions);
        if (jsResult.code) {
          await fs.writeFile(filePath, jsResult.code);
          jsCount++;
        }
      } else if (ext === ".css") {
        const codeBuffer = await fs.readFile(filePath);
        const cssResult = lightningcss.transform({
          filename: filePath,
          code: codeBuffer,
          minify: true,
          sourceMap: false,
        });

        await fs.writeFile(filePath, cssResult.code);
        cssCount++;
      } else if (ext === ".html" || ext === ".htm") {
        const originalCode = await fs.readFile(filePath, "utf8");
        const htmlOptions: HTMLMinifyOptions = {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: (text) => {
            return lightningcss
              .transform({
                filename: "inline.css",
                code: Buffer.from(text),
                minify: true,
              })
              .code.toString();
          },
        };
        const htmlResult = await minifyHTML(originalCode, htmlOptions);
        await fs.writeFile(filePath, htmlResult);
        htmlCount++;
      }
    });

    console.log("\nProduction optimization complete!");
    console.log(
      `Optimized: ${jsCount} JS | ${cssCount} CSS | ${htmlCount} HTML files.`,
    );
  } catch (error) {
    console.error("\nOptimization failed:", error);
    process.exit(1);
  }
}

export default minifySite;
