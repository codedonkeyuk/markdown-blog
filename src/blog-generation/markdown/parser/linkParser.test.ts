import { describe, it } from "node:test";
import assert from "node:assert";
import { linkRegex, linkParse } from "./linkParser.ts";

describe("Link Parser Module", () => {
  describe("Integration with .replace()", () => {
    it("should correctly convert markdown link syntax into an HTML anchor tag", () => {
      const input = "Check out [Google](https://google.com).";
      const output = input.replace(linkRegex, linkParse);

      assert.strictEqual(
        output,
        'Check out <a href="https://google.com" target="_blank" rel="noopener">Google</a>.',
      );
    });

    it("should handle multiple links in a single line of text", () => {
      const input =
        "Go to [GitHub](https://github.com) or [NPM](https://npmjs.com).";
      const output = input.replace(linkRegex, linkParse);

      assert.strictEqual(
        output,
        'Go to <a href="https://github.com" target="_blank" rel="noopener">GitHub</a> or <a href="https://npmjs.com" target="_blank" rel="noopener">NPM</a>.',
      );
    });

    it("should allow special characters or spaces inside the anchor text", () => {
      const input = "Click [My Awesome Team Website!](https://team.internal)";
      const output = input.replace(linkRegex, linkParse);

      assert.strictEqual(
        output,
        'Click <a href="https://team.internal" target="_blank" rel="noopener">My Awesome Team Website!</a>',
      );
    });

    it("should ignore broken markdown layouts missing brackets or parentheses", () => {
      const input = "This is broken [Google]https://google.com";
      const output = input.replace(linkRegex, linkParse);

      assert.strictEqual(output, "This is broken [Google]https://google.com");
    });
  });
});
