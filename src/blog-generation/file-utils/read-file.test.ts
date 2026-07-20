import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";

describe("Test read-file.ts", async () => {
  const fileReadMock = mock.fn() as Mock<
    (path: string, encoding?: string) => Promise<string>
  >;

  beforeEach(async () => {
    const fsExports = await import("fs/promises").then(
      ({ default: _, ...rest }) => ({
        ...rest,
        readFile: fileReadMock,
      }),
    );

    mock.module("fs/promises", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    fileReadMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.readFile is called with correct arguments and returns file content", async () => {
    const expectedContent = "Hello, world!";

    fileReadMock.mock.mockImplementation(async () => expectedContent);

    const testee = await import("./read-file.ts");

    const result = await testee.default("./test-file.txt");

    assert.strictEqual(fileReadMock.mock.callCount(), 1);
    assert.strictEqual(
      fileReadMock.mock.calls[0].arguments[0],
      "./test-file.txt",
    );
    assert.strictEqual(fileReadMock.mock.calls[0].arguments[1], "utf-8");
    assert.strictEqual(result, expectedContent);
  });
});
