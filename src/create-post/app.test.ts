import test from "node:test";
import assert from "node:assert";
import { EventEmitter } from "events";

test("Unit Test: app.ts captures stdin and executes file creators", async (t) => {
  let mockCreatedDir = "";
  const mockCreatedFiles: Record<string, string> = {};

  t.mock.module("../blog-generation/file-utils/create-dir.ts", {
    namedExports: {
      default: async (dirPath: string) => {
        mockCreatedDir = dirPath;
      },
    },
  });

  t.mock.module("../blog-generation/file-utils/create-file.ts", {
    namedExports: {
      default: async (filePath: string, contents: string) => {
        mockCreatedFiles[filePath] = contents.trim();
      },
    },
  });

  const logSpy = t.mock.method(console, "log");
  const mockStdin = new EventEmitter() as any;
  mockStdin.resume = t.mock.fn();
  mockStdin.pause = t.mock.fn();
  mockStdin.setEncoding = t.mock.fn();

  t.mock.getter(process, "stdin", () => mockStdin);

  await import("./app.ts");

  assert.strictEqual(
    logSpy.mock.calls[0].arguments[0],
    "What is the name of the post?",
  );

  mockStdin.emit("data", "My New Test Blog Post");

  await new Promise((resolve) => setTimeout(resolve, 10));

  assert.strictEqual(mockStdin.pause.mock.calls.length, 1);
  assert.match(
    mockCreatedDir,
    /^\.\/assets\/blog-content\/\d+_my-new-test-blog-post$/,
  );

  const filenames = Object.keys(mockCreatedFiles);
  assert.strictEqual(filenames.length, 4);

  const jsonFile = filenames.find((name) => name.endsWith("postInfo.json"))!;
  const metadata = JSON.parse(mockCreatedFiles[jsonFile]);

  assert.strictEqual(metadata.name, "My New Test Blog Post");
  assert.strictEqual(metadata.nameSlug, "my-new-test-blog-post");
  assert.strictEqual(metadata.author, "Lee G");
});
