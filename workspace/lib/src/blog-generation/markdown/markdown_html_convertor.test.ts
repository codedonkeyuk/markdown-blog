import { describe, it, mock } from "node:test";
import assert from "node:assert";

const headerParseSpy = mock.fn(() => "header-replaced");
const imageParseSpy = mock.fn(() => "image-replaced");
const bulletListParseSpy = mock.fn(() => "bullet-list-replaced");
const orderedListParseSpy = mock.fn(() => "ordered-list-replaced");
const tableParseSpy = mock.fn(() => "table-replaced");

mock.module("./parser/paragraphParser.ts", {
  namedExports: {
    paragraphRegex: /_PARAGRAPH_/g,
    paragraphParse: "paragraph-replaced",
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

mock.module("./parser/tableParser.ts", {
  namedExports: {
    tableRegex: /_TABLE_/g,
    tableParse: tableParseSpy,
  },
});

const { default: markdownHtmlConvertor } =
  await import("./markdown_html_convertor.ts");

describe("Markdown HTML Converter Unit Test", () => {
  it("should invoke every single replacement method in the pipeline sequence", async () => {
    const input = [
      "_HEADER_",
      "_PARAGRAPH_",
      "_IMAGE_",
      "_BULLET_LIST_",
      "_ORDERED_LIST_",
      "_TABLE_",
    ].join("\n\n");

    const results = await markdownHtmlConvertor("/images/", input);

    assert.strictEqual(
      results,
      "header-replaced\n\nparagraph-replaced\n\nimage-replaced\n\nbullet-list-replaced\n\nordered-list-replaced\n\ntable-replaced",
    );
    assert.strictEqual(headerParseSpy.mock.callCount(), 1);
    assert.strictEqual(imageParseSpy.mock.callCount(), 1);
    assert.strictEqual(bulletListParseSpy.mock.callCount(), 1);
    assert.strictEqual(orderedListParseSpy.mock.callCount(), 1);
    assert.strictEqual(tableParseSpy.mock.callCount(), 1);
  });
});
