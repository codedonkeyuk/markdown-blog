import { describe, it, mock } from "node:test";
import assert from "node:assert";
import type {
  orderedListParse,
  orderedListRegex,
} from "./parser/orderedListParser.ts";

const boldParseSpy = mock.fn(() => "bold-replaced");
const underlineParseSpy = mock.fn(() => "underline-replaced");
const italicParseSpy = mock.fn(() => "italic-replaced");
const headerParseSpy = mock.fn(() => "header-replaced");
const imageParseSpy = mock.fn(() => "image-replaced");
const bulletListParseSpy = mock.fn(() => "bullet-list-replaced");
const orderedListParseSpy = mock.fn(() => "ordered-list-replaced");

mock.module("./parser/boldParser.ts", {
  namedExports: { boldRegex: /_BOLD_/g, boldParse: boldParseSpy },
});
mock.module("./parser/underlineParser.ts", {
  namedExports: {
    underlineRegex: /_UNDERLINE_/g,
    underlineParse: underlineParseSpy,
  },
});
mock.module("./parser/italicParser.ts", {
  namedExports: { italicRegex: /_ITALIC_/g, italicParse: italicParseSpy },
});
mock.module("./parser/linkParser.ts", {
  namedExports: { linkRegex: /_LINK_/g, linkParse: "[link-replaced]" },
});
mock.module("./parser/paragraphParser.ts", {
  namedExports: {
    paragraphRegex: /_PARAGRAPH_/g,
    paragraphParse: "[paragraph-replaced]",
  },
});
mock.module("./parser/headerParser.ts", {
  namedExports: { headerRegex: /_HEADER_/g, headerParse: headerParseSpy },
});
mock.module("./parser/imageParser.ts", {
  namedExports: { imageRegex: /_IMAGE_/g, imageParse: imageParseSpy },
});
mock.module("./parser/bulletListParser.ts", {
  namedExports: {
    bulletListRegex: /_BULLET_LIST_/g,
    bulletListParse: bulletListParseSpy,
  },
});
mock.module("./parser/orderedListParser.ts", {
  namedExports: {
    orderedListRegex: /_ORDERED_LIST_/g,
    orderedListParse: orderedListParseSpy,
  },
});

const { default: markdownHtmlConvertor } =
  await import("./markdown_html_convertor.ts");

describe("Markdown HTML Converter Unit Test", () => {
  it("should invoke every single replacement method in the pipeline sequence", async () => {
    const input = `_HEADER_ _BOLD_ _UNDERLINE_ _ITALIC_ _LINK_ _PARAGRAPH_ _IMAGE_ _BULLET_LIST_ _ORDERED_LIST_`;

    const results = await markdownHtmlConvertor(input);

    assert.strictEqual(
      results,
      "header-replaced bold-replaced underline-replaced italic-replaced [link-replaced] [paragraph-replaced] image-replaced bullet-list-replaced ordered-list-replaced",
    );

    assert.strictEqual(boldParseSpy.mock.callCount(), 1);
    assert.strictEqual(underlineParseSpy.mock.callCount(), 1);
    assert.strictEqual(italicParseSpy.mock.callCount(), 1);
    assert.strictEqual(headerParseSpy.mock.callCount(), 1);
    assert.strictEqual(imageParseSpy.mock.callCount(), 1);
    assert.strictEqual(bulletListParseSpy.mock.callCount(), 1);
    assert.strictEqual(orderedListParseSpy.mock.callCount(), 1);
  });
});
