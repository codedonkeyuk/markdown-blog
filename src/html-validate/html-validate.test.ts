import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";

describe("Test html-validate-dev.ts", async () => {
  const htmlValidateMock = mock.fn() as Mock<(path: string) => Promise<string>>;

  beforeEach(async () => {
    mock.module("./html-validate.ts", {
      defaultExport: htmlValidateMock,
    });
  });

  afterEach(() => {
    htmlValidateMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure html-validate is called, with correct arguements", async () => {
    await import("./html-validate-dev.ts");
    assert.strictEqual(htmlValidateMock.mock.callCount(), 1);
    assert.deepStrictEqual(htmlValidateMock.mock.calls[0].arguments, [
      "./assets/site",
      {
        "doctype-style": "off",
        "no-implicit-button-type": "off",
        "unique-landmark": "off",
        "no-inline-style": "off",
        "void-style": [
          "error",
          {
            style: "selfclosing",
          },
        ],
      },
    ]);
  });
});
