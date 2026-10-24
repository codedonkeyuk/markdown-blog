import { describe, it } from "node:test";
import assert from "node:assert";
import { headerRegex, headerParse } from "./headerParser.ts";

describe("Header Parser Module", () => {
  describe("Isolated Function Arguments", () => {
    it("should throw an error for a single hash (H1)", () => {
      assert.throws(() => headerParse("# Heading 1", "#", "Heading 1"), {
        message:
          "Header 1 (<H1>) is generated from post entry. Only H2+ is supported.",
      });
    });

    it("should determine h3 level based on a three-hash character string", () => {
      const result = headerParse("### Heading 3", "###", "Heading 3");
      assert.strictEqual(result, "<h3>Heading 3</h3>");
    });
  });

  describe("Integration with .replace()", () => {
    it("should throw an error when converting an H1 string format", () => {
      const input = "# Title";
      assert.throws(() => input.replace(headerRegex, headerParse), {
        message:
          "Header 1 (<H1>) is generated from post entry. Only H2+ is supported.",
      });
    });

    it("should successfully convert an H6 string format", () => {
      const input = "###### Small Title";
      const output = input.replace(headerRegex, headerParse);
      assert.strictEqual(output, "<h6>Small Title</h6>");
    });

    it("should throw an error if any H1 exists among multiple headers across lines", () => {
      const input = "# Header One\n### Header Three";
      assert.throws(() => input.replace(headerRegex, headerParse), {
        message:
          "Header 1 (<H1>) is generated from post entry. Only H2+ is supported.",
      });
    });

    it("should successfully process multiple allowed headers across distinct lines", () => {
      const input = "## Header Two\n### Header Three";
      const output = input.replace(headerRegex, headerParse);
      assert.strictEqual(output, "<h2>Header Two</h2>\n<h3>Header Three</h3>");
    });

    it("should ignore hashes that do not have a following space character", () => {
      const input = "#NotAHeader because there is no space";
      const output = input.replace(headerRegex, headerParse);
      assert.strictEqual(output, "#NotAHeader because there is no space");
    });
  });
});
