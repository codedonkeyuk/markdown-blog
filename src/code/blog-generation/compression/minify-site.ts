import * as fs from "fs";
import * as path from "path";
import { minify as minifyJS, type MinifyOptions } from "terser";
import * as lightningcss from "lightningcss"; // 1. Swapped out CleanCSS
import {
  minify as minifyHTML,
  type Options as HTMLMinifyOptions,
} from "html-minifier-terser";
import appConfig from "../../app-config.ts";

const { productionPath } = appConfig();
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

      if (ext === ".js") {
        const originalCode = fs.readFileSync(filePath, "utf8");
        const jsOptions: MinifyOptions = { mangle: true, compress: true };
        const jsResult = await minifyJS(originalCode, jsOptions);
        if (jsResult.code) {
          fs.writeFileSync(filePath, jsResult.code);
          jsCount++;
        }
      } else if (ext === ".css") {
        // 2. Optimized CSS using LightningCSS (Natively compiles & minifies nested blocks)
        const cssResult = lightningcss.transform({
          filename: filePath,
          code: fs.readFileSync(filePath), // Pass buffer directly
          minify: true,
          sourceMap: false,
        });

        fs.writeFileSync(filePath, cssResult.code);
        cssCount++;
      } else if (ext === ".html" || ext === ".htm") {
        const originalCode = fs.readFileSync(filePath, "utf8");
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
