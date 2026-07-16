import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";
import { type Dirent } from "fs";
import type { ObjectEncodingOptions, PathLike } from "node:fs";

describe("Test read-directories.ts", async () => {
  const readdirMock = mock.fn() as Mock<
    (
      path: PathLike,
      options: ObjectEncodingOptions & {
        withFileTypes: true;
        recursive?: boolean | undefined;
      },
    ) => Promise<Dirent[]>
  >;

  beforeEach(async () => {
    const fsExports = await import("fs/promises").then(
      ({ default: _, ...rest }) => ({
        ...rest,
        readdir: readdirMock,
      }),
    );
    mock.module("fs/promises", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    readdirMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.readdirSync is called with correct arguments and returns directory names", async () => {
    const mockFiles = [
      { name: "file1.txt", isDirectory: () => false },
      { name: "dir1", isDirectory: () => true },
      { name: "file2.js", isDirectory: () => false },
      { name: "dir2", isDirectory: () => true },
    ] as Dirent[];
    readdirMock.mock.mockImplementation(async () => mockFiles);

    const testee = await import("./read-directories.ts");
    const result = await testee.default("./test-dir");

    assert.strictEqual(readdirMock.mock.callCount(), 1);
    assert.strictEqual(readdirMock.mock.calls[0].arguments[0], "./test-dir");
    assert.deepStrictEqual(readdirMock.mock.calls[0].arguments[1], {
      withFileTypes: true,
    });
    assert.deepStrictEqual(result, ["dir1", "dir2"]);
  });
});
