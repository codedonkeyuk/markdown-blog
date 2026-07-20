import { describe, it } from "node:test";
import assert from "node:assert";
import { parseCodeBlocks } from "./codeParser.ts";

describe("Code Block Parser Module", () => {
  it("should convert a basic javascript fenced code block into Shiki inline HTML styles", async () => {
    const markdown = "```javascript\nconst a = 1;\n```";
    const result = await parseCodeBlocks(markdown);

    assert.match(result, /<pre class="shiki/);
    assert.match(result, /style="background-color:/);
    assert.match(result, /const/);
  });

  it("should degrade safely to standard fallback code tags if given an unknown language", async () => {
    const markdown = "```not-a-real-lang\nsome raw data\n```";
    const result = await parseCodeBlocks(markdown);

    const expectedFallback =
      '<pre><code class="language-not-a-real-lang">some raw data</h1>';
    assert.match(result, /<code class="language-not-a-real-lang">/);
  });

  it("should preserve surrounding layout text bounds safely without breaking spacings", async () => {
    const markdown = "Top text\n\n```ts\nconst num = 42;\n```\n\nBottom text";
    const result = await parseCodeBlocks(markdown);

    assert.match(result, /^Top text/);
    assert.match(result, /Bottom text$/);
  });
});
