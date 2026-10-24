import { HtmlValidate, type Report, type RuleConfig } from "html-validate";
import * as path from "path";
import * as fs from "fs";

async function htmlValidate(
  TARGET_DIR: string,
  rules: RuleConfig,
): Promise<void> {
  console.log(
    `Searching for HTML files to validate in: ${path.resolve(TARGET_DIR)}...\n`,
  );

  const htmlvalidate = new HtmlValidate({
    extends: ["html-validate:recommended"],
    rules,
  });
  const allFiles: string[] = fs.readdirSync(TARGET_DIR, {
    recursive: true,
  }) as string[];

  const htmlFiles: string[] = allFiles
    .map((file: string) => path.resolve(TARGET_DIR, file))
    .filter((filePath: string) => {
      return (
        fs.statSync(filePath).isFile() &&
        path.extname(filePath).toLowerCase() === ".html"
      );
    });

  if (htmlFiles.length === 0) {
    console.log("No HTML files found to validate.");
    return;
  }

  console.log(
    `Found ${htmlFiles.length} HTML file(s). Starting validation...\n`,
  );
  console.log("==================================================\n");

  let totalErrors: number = 0;
  let totalWarnings: number = 0;

  for (const filePath of htmlFiles) {
    const relativeDisplayPath: string = path.relative(process.cwd(), filePath);
    const htmlContent: string = fs.readFileSync(filePath, "utf-8");

    const report: Report = await htmlvalidate.validateString(
      htmlContent,
      filePath,
    );

    if (report.valid) {
      console.log(`${relativeDisplayPath} - Valid!`);
    } else {
      console.log(`${relativeDisplayPath} - Failed validation:`);

      report.results.forEach((result) => {
        result.messages.forEach((msg) => {
          const type = msg.severity === 2 ? "ERROR" : "WARNING";
          if (msg.severity === 2) totalErrors++;
          else totalWarnings++;

          console.log(
            `   [Line ${msg.line}:${msg.column}] [${type}] ${msg.message} (${msg.ruleId})`,
          );
        });
      });
      console.log("");
    }
  }

  console.log("\n==================================================");

  if (totalErrors > 0 || totalWarnings > 0) {
    console.error(
      `Validation Complete! Total Errors: ${totalErrors}, Total Warnings: ${totalWarnings}`,
    );
    process.exit(1);
  } else {
    console.log(`Validation Complete! No Issues`);
  }
}

export default htmlValidate;
