import { describe, it } from "node:test";
import assert from "node:assert";
import { italicRegex, italicParse } from "./italicParser.ts";

describe("Italic Parser Module", () => {
  describe("Isolated Function Logic", () => {
    it("should use the 2nd argument (italic1) when asterisks match", () => {
      // Passes text into the 2nd argument position
      const result = italicParse("*hello*", "hello", undefined as any);
      assert.strictEqual(result, "<em>hello</em>");
    });

    it("should use the 3rd argument (italic2) when underscores match", () => {
      // Passes text into the 3rd argument position to test the fallback logic
      const result = italicParse("_world_", undefined as any, "world");
      assert.strictEqual(result, "<em>world</em>");
    });
  });

  describe("Integration with .replace()", () => {
    it("should convert single asterisks markdown to em HTML tags", () => {
      const input = "This is *italicized* text.";
      const output = input.replace(italicRegex, italicParse);
      assert.strictEqual(output, "This is <em>italicized</em> text.");
    });

    it("should convert single underscores markdown to em HTML tags", () => {
      const input = "This is _emphasized_ text.";
      const output = input.replace(italicRegex, italicParse);
      assert.strictEqual(output, "This is <em>emphasized</em> text.");
    });

    it("should handle multiple italic matches in a single string", () => {
      const input = "Enjoy *this* and _that_ style.";
      const output = input.replace(italicRegex, italicParse);
      assert.strictEqual(
        output,
        "Enjoy <em>this</em> and <em>that</em> style.",
      );
    });

    it("should ignore regular text without markdown formatting", () => {
      const input = "Normal string without markers.";
      const output = input.replace(italicRegex, italicParse);
      assert.strictEqual(output, "Normal string without markers.");
    });
  });
});
