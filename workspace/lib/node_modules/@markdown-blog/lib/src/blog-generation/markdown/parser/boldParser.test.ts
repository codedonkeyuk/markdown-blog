import { describe, it } from "node:test";
import assert from "node:assert";
import { boldRegex, boldParse } from "./boldParser.ts";

describe("Bold Parser Module", () => {
  describe("Isolated Function Arguments", () => {
    it("should use the 2nd argument (bold1) when asterisks match", () => {
      const result = boldParse("**hello**", "hello", undefined);
      assert.strictEqual(result, "<strong>hello</strong>");
    });

    it("should use the 3rd argument (bold2) when underscores match", () => {
      const result = boldParse("__world__", undefined, "world");
      assert.strictEqual(result, "<strong>world</strong>");
    });
  });

  describe("Integration with .replace()", () => {
    it("should correctly shift text to the 3rd argument when evaluating underscores", () => {
      const input = "This is __important__.";

      const output = input.replace(boldRegex, boldParse);

      assert.strictEqual(output, "This is <strong>important</strong>.");
    });

    it("should handle both argument positions in a single string", () => {
      const input = "Mix **stars** and __lines__.";
      const output = input.replace(boldRegex, boldParse);

      assert.strictEqual(
        output,
        "Mix <strong>stars</strong> and <strong>lines</strong>.",
      );
    });
  });
});
