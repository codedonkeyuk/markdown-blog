import { describe, it } from "node:test";
import assert from "node:assert";
import { paragraphRegex, paragraphParse } from "./paragraphParser.ts"; // Update path if needed

describe("Line-Based Paragraph Parser Module", () => {
  describe("Integration with .replace()", () => {
    it("should successfully wrap a plain line of text in paragraph tags", () => {
      const input = "This is a simple text sentence.";
      const output = input.replace(paragraphRegex, paragraphParse);

      assert.strictEqual(output, "<p>This is a simple text sentence.</p>");
    });

    it("should skip empty lines or strings containing only whitespace formatting", () => {
      const input = "   ";
      const output = input.replace(paragraphRegex, paragraphParse);

      assert.strictEqual(output, "   ");
    });

    it("should completely skip lines that begin with an HTML tag structure (<)", () => {
      const inputs = [
        "<ul>",
        "  <li>List item</li>",
        '<pre class="shiki">',
        "<h2>Header Title</h2>",
      ];

      for (const input of inputs) {
        const output = input.replace(paragraphRegex, paragraphParse);
        assert.strictEqual(output, input);
      }
    });

    it("should skip lines starting with markdown block tokens like hashes or bullets", () => {
      const inputs = [
        "# Header One",
        "* Bullet Item",
        "  - Nested Bullet Item",
        "1. Ordered Item Step",
      ];

      for (const input of inputs) {
        const output = input.replace(paragraphRegex, paragraphParse);
        assert.strictEqual(output, input);
      }
    });

    it("should wrap multiple valid plain lines independently across a multiline text block", () => {
      const input = "Line number one\nLine number two";
      const output = input.replace(paragraphRegex, paragraphParse);

      const expected = "<p>Line number one</p>\n<p>Line number two</p>";
      assert.strictEqual(output, expected);
    });
  });
});
