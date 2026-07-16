import * as fs from "fs";
import * as path from "path";
import { minify as minifyJS, type MinifyOptions } from "terser";
import CleanCSS from "clean-css";
import {
  minify as minifyHTML,
  type Options as HTMLMinifyOptions,
} from "html-minifier-terser";
import { productionPath } from "../../app-config.ts";

const DIST_DIR: string = path.resolve(productionPath);

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];

  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

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
    for (const filePath of allFiles) {
      const ext = path.extname(filePath).toLowerCase();
      const originalCode = fs.readFileSync(filePath, "utf8");

      if (ext === ".js") {
        const jsOptions: MinifyOptions = {
          mangle: true,
          compress: true,
        };
        const jsResult = await minifyJS(originalCode, jsOptions);
        if (jsResult.code) {
          fs.writeFileSync(filePath, jsResult.code);
          jsCount++;
        }
      } else if (ext === ".css") {
        const cssResult = new CleanCSS({ level: 2, inline: false }).minify(
          originalCode,
        );
        if (cssResult.errors.length > 0) {
          throw new Error(
            `CSS Error in ${filePath}: ${cssResult.errors.join("\n")}`,
          );
        }
        fs.writeFileSync(filePath, cssResult.styles);
        cssCount++;
      } else if (ext === ".html" || ext === ".htm") {
        const htmlOptions: HTMLMinifyOptions = {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
        };
        const htmlResult = await minifyHTML(originalCode, htmlOptions);
        fs.writeFileSync(filePath, htmlResult);
        htmlCount++;
      }
    }

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
