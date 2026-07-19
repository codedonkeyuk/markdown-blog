import { type PostInfo } from "../types.ts";
import { spellCheckDocument, type ValidationIssue } from "cspell-lib";
import { resolve } from "path";

import { postSourcePath, maxParallelProcesses } from "../../app-config.ts";
import asyncPool from "../thread-management/async-pool.ts";
import { pathToFileURL } from "url";

const customWords: string[] = [];

export async function spellCheck(postInfo: PostInfo[]): Promise<void> {
  let allIssues: (any[] | ValidationIssue)[] = [];

  await asyncPool(postInfo, maxParallelProcesses, async (post) => {
    const targetFile = `${postSourcePath}/${post.directory}/content.md`;
    const uri = pathToFileURL(resolve(targetFile)).toString();

    const result = await spellCheckDocument(
      { uri },
      { generateSuggestions: true, noConfigSearch: true },
      { words: customWords, suggestionsTimeout: 2000 },
    );

    const contextualIssues = result.issues.map((issue) => ({
      ...issue,
      uri: uri,
    }));

    allIssues.push(...contextualIssues);
  });

  if (allIssues.length > 0) {
    console.error(
      `\n❌ Spelling validation failed with ${allIssues.length} total error(s) across posts.`,
    );

    allIssues.forEach((item) => {
      const issue = item as any;

      let lineNumber = "unknown";
      let columnNumber = issue.col || "unknown";

      if (issue.line && typeof issue.line === "object") {
        if (
          issue.line.position &&
          typeof issue.line.position.line === "number"
        ) {
          lineNumber = issue.line.position.line + 1;
        }

        if (
          typeof issue.line.offset === "number" &&
          typeof issue.offset === "number"
        ) {
          columnNumber = issue.offset - issue.line.offset + 1;
        }
      }

      console.error(`\n📄 Issue found in: ${issue.uri || "Unknown File"}`);
      console.error(
        `  [Line ${lineNumber}:${columnNumber}] ➜ Unknown word: "${issue.text}"`,
      );

      if (issue.context?.text) {
        console.error(`     Context: ... ${issue.context.text.trim()} ...`);
      }

      if (issue.suggestions && issue.suggestions.length > 0) {
        const topSuggestions = issue.suggestions.slice(0, 4).join(", ");
        console.error(`     Suggestions: [ ${topSuggestions} ]`);
      }
    });

    console.error("\n");
    process.exit(1);
  }

  console.log("All post content files passed spelling verification!");
}
