import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test create-dir.ts", async () => {
  const mkdirSyncMock = mock.fn();

  beforeEach(async () => {
    const fsExports = await import("fs/promises").then(
      ({ default: _, ...rest }) => ({
        ...rest,
        mkdir: mkdirSyncMock,
      }),
    );
    mock.module("fs/promises", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    mkdirSyncMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.mkdirSync is called with correct arguments", async () => {
    const testee = await import("./create-dir.ts");
    await testee.default("./test-dir");
    assert.strictEqual(mkdirSyncMock.mock.callCount(), 1);
    assert.strictEqual(mkdirSyncMock.mock.calls[0].arguments[0], "./test-dir");
    assert.deepStrictEqual(mkdirSyncMock.mock.calls[0].arguments[1], {
      recursive: true,
    });
  });
});
