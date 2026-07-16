import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test create-file.ts", async () => {
  const writeFileSyncMock = mock.fn(async () => {});

  beforeEach(async () => {
    const fsExports = await import("fs/promises").then(
      ({ default: _, ...rest }) => ({
        ...rest,
        writeFile: writeFileSyncMock,
      }),
    );
    mock.module("fs/promises", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    writeFileSyncMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.writeFileSync is called with correct arguments", async () => {
    const testee = await import("../file-utils/create-file.ts");
    testee.default("./test-file.txt", "Hello World");
    assert.strictEqual(writeFileSyncMock.mock.callCount(), 1);

    assert.deepStrictEqual(writeFileSyncMock.mock.calls[0].arguments, [
      "./test-file.txt",
      "Hello World",
      {
        encoding: "utf8",
      },
    ]);
  });
});
