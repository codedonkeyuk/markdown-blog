import { describe, it } from "node:test";
import assert from "node:assert";
import { underlineRegex, underlineParse } from "./underlineParser.ts";

describe("Underline Parser Module", () => {
  describe("Integration with .replace()", () => {
    it("should correctly convert single underscores into underline HTML tags", () => {
      const input = "This text has an _underlined_ word.";
      const output = input.replace(underlineRegex, underlineParse);

      assert.strictEqual(output, "This text has an <u>underlined</u> word.");
    });

    it("should handle multiple underlined items on a single line", () => {
      const input = "Please _stop_ and _read_ this carefully.";
      const output = input.replace(underlineRegex, underlineParse);

      assert.strictEqual(
        output,
        "Please <u>stop</u> and <u>read</u> this carefully.",
      );
    });

    it("should match multiple words inside a single set of underscores", () => {
      const input = "This is a _completely underlined sentence_.";
      const output = input.replace(underlineRegex, underlineParse);

      assert.strictEqual(
        output,
        "This is a <u>completely underlined sentence</u>.",
      );
    });

    it("should ignore regular plaintext without underscore markers", () => {
      const input = "No special formatting applied here.";
      const output = input.replace(underlineRegex, underlineParse);

      assert.strictEqual(output, "No special formatting applied here.");
    });
  });
});
