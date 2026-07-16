import { describe, it } from "node:test";
import assert from "node:assert";
import { bulletListRegex, bulletListParse } from "./bulletListParser.ts";

describe("Bullet List Parser Module", () => {
  describe("Isolated Function Arguments", () => {
    it("should parse a single flat bullet item into a complete ul block", () => {
      const input = "* Item One";
      const result = bulletListParse(input);
      const expected = "<ul>\n<li>Item One</li>\n</ul>";
      assert.strictEqual(result, expected);
    });

    it("should manage deeper nested items accurately using indentation", () => {
      const input = "* Parent\n  * Child";
      const result = bulletListParse(input);
      // Fixed: Removed closing </li> from Parent line and closed it after sublist
      const expected =
        "<ul>\n<li>Parent\n<ul>\n<li>Child</li>\n</ul>\n</li>\n</ul>";
      assert.strictEqual(result, expected);
    });

    it("should safely handle and standardize tab character indentation", () => {
      const input = "* Parent\n\t* Tabbed Child";
      const result = bulletListParse(input);
      // Fixed: Ensured clean nesting structure
      const expected =
        "<ul>\n<li>Parent\n<ul>\n<li>Tabbed Child</li>\n</ul>\n</li>\n</ul>";
      assert.strictEqual(result, expected);
    });
  });

  describe("Integration with .replace()", () => {
    it("should automatically close inner ul tags when indentation decreases", () => {
      const input = "* Level 1\n  * Level 2\n* Back to Level 1";
      const output = input.replace(bulletListRegex, bulletListParse);
      // Fixed: Valid nesting alignment
      const expected =
        "<ul>\n<li>Level 1\n<ul>\n<li>Level 2</li>\n</ul>\n</li>\n<li>Back to Level 1</li>\n</ul>";
      assert.strictEqual(output, expected);
    });

    it("should handle varying bullet symbols (+, -, *) together seamlessly", () => {
      const input = "* Asterisk\n  - Dash\n    + Plus";
      const output = input.replace(bulletListRegex, bulletListParse);
      // Fixed: Multi-tier deeply embedded nesting
      const expected =
        "<ul>\n<li>Asterisk\n<ul>\n<li>Dash\n<ul>\n<li>Plus</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>";
      assert.strictEqual(output, expected);
    });
  });
});
