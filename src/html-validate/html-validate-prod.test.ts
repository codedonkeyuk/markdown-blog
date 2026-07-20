import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";

describe("Test html-validate-prod.ts", async () => {
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
    await import("./html-validate-prod.ts");
    assert.strictEqual(htmlValidateMock.mock.callCount(), 1);
    assert.deepStrictEqual(htmlValidateMock.mock.calls[0].arguments, [
      "./tmp/site",
      {
        "attr-case": "off",
        "attr-quotes": "off",
        "attribute-boolean-style": "off",
        "doctype-style": "off",
        "element-case": "off",
        "no-implicit-button-type": "off",
        "no-trailing-spaces": "off",
        "unique-landmark": "off",
        "void-style": "off",
        whitespace: "off",
        "no-inline-style": "off",
      },
    ]);
  });
});
