import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { spellCheck } from "./spell-check.ts"; // Adjust path to your file
import { type PostInfo } from "../types.ts";
import { postSourcePath } from "../../app-config.ts";

test("Spellcheck plugin validation pipeline", async (t) => {
  const mockPost: PostInfo = {
    creationDate: "2026-07-19",
    creationTime: "12:00",
    creationTimestamp: Date.now(),
    name: "Test Post",
    nameSlug: "test-post",
    pageDescription: "Description",
    postThumbDescription: "Thumb",
    pageImageDescription: "Image",
    author: "Author",
    blogDirectory: "blog",
    dateDirectory: "2026/07",
    directory: "mock-test-post-directory",
    blogPage: "index.html",
    blogUrl: "https://example.com",
    publish: true,
  };

  const targetDir = path.resolve(`${postSourcePath}/${mockPost.directory}`);
  const targetFilePath = path.join(targetDir, "content.md");

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(
    targetFilePath,
    "This is a post with a clear badt typo inside.",
  );

  const originalExit = process.exit;
  const originalConsoleError = console.error;

  let capturedExitCode: number | undefined = undefined;
  let errorLogOutput = "";

  t.after(() => {
    try {
      fs.rmSync(targetDir, { recursive: true, force: true });
    } catch {}
    process.exit = originalExit;
    console.error = originalConsoleError;
  });

  await t.test(
    "should fail validation and output details when typos exist",
    async () => {
      process.exit = (code?: number | string | null | undefined): never => {
        capturedExitCode = code as number;
        return undefined as never;
      };

      console.error = (...args: any[]) => {
        errorLogOutput += args.join(" ") + "\n";
      };

      await spellCheck([mockPost]);

      assert.strictEqual(
        capturedExitCode,
        1,
        "Process should exit with code 1 on spelling failures.",
      );
      assert.match(
        errorLogOutput,
        /Unknown word: "badt"/,
        "Console logs should list the specific misspelling.",
      );
      assert.match(
        errorLogOutput,
        /Suggestions:/,
        "Console logs should output spelling suggestions.",
      );
    },
  );

  await t.test(
    "should pass validation smoothly when content is cleanly spelled",
    async () => {
      capturedExitCode = undefined;
      errorLogOutput = "";

      fs.writeFileSync(
        targetFilePath,
        "This text contains words that match the dictionary.",
      );

      await spellCheck([mockPost]);

      assert.strictEqual(
        capturedExitCode,
        undefined,
        "Process should not exit if there are zero errors.",
      );
    },
  );
});
