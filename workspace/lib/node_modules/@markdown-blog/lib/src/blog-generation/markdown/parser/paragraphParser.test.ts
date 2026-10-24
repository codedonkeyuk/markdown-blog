import { describe, it } from "node:test";
import assert from "node:assert";
import { paragraphRegex, paragraphParse } from "./paragraphParser.ts";

describe("Block-Based Paragraph Parser Module", () => {
  describe("Integration with .replace()", () => {
    it("should successfully wrap a plain block of text in paragraph tags", () => {
      const input = "This is a simple text sentence.";
      const output = input.replace(paragraphRegex, paragraphParse);

      assert.strictEqual(output, "<p>This is a simple text sentence.</p>");
    });

    it("should safely process a text block that spans across multiple lines", () => {
      const input = "Line number one\nLine number two";
      const output = input.replace(paragraphRegex, paragraphParse);

      const expected = "<p>Line number one\nLine number two</p>";
      assert.strictEqual(output, expected);
    });
  });
});
