import test from "node:test";
import assert from "node:assert";

test("Unit: Script prints log and triggers delete utility", async (t) => {
  let passedPath = "";
  t.mock.module("../blog-generation/file-utils/delete-dir-contents.ts", {
    namedExports: {
      default: async (dirPath: string) => {
        passedPath = dirPath;
      },
    },
  });

  const logSpy = t.mock.method(console, "log");

  await import("./app.ts");

  assert.strictEqual(
    logSpy.mock.calls[0].arguments[0],
    "Deleteing dist directory",
  );
  assert.ok(passedPath.includes("dist") || passedPath !== "");
});
