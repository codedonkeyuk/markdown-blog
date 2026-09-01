import { describe, it } from "node:test";
import assert from "node:assert";
import { orderedListRegex, orderedListParse } from "./orderedListParser.ts";

describe("Ordered List Parser Module", () => {
  describe("Isolated Function Arguments", () => {
    it("should manage deeper nested items accurately using indentation", () => {
      const input = "1. Parent\n  1. Child";
      const result = orderedListParse(input);
      const expected =
        "<ol>\n<li>Parent\n<ol>\n<li>Child</li>\n</ol>\n</li>\n</ol>";
      assert.strictEqual(result, expected);
    });
  });

  describe("Integration with .replace()", () => {
    it("should automatically close inner ol tags when indentation decreases", () => {
      const input = "1. Level 1\n  1. Level 2\n2. Back to Level 1";
      const output = input.replace(orderedListRegex, orderedListParse);
      const expected =
        "<ol>\n<li>Level 1\n<ol>\n<li>Level 2</li>\n</ol>\n</li>\n<li>Back to Level 1</li>\n</ol>";
      assert.strictEqual(output, expected);
    });

    it("should escape HTML special characters in the list content", () => {
      const input = '1. Item with <brackets> & "quotes"';
      const output = input.replace(orderedListRegex, orderedListParse);
      const expected =
        "<ol>\n<li>Item with &lt;brackets&gt; &amp; &quot;quotes&quot;</li>\n</ol>";
      assert.strictEqual(output, expected);
    });
  });
});
