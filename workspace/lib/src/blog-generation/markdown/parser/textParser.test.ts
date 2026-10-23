import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";

mock.module("./linkParser.ts", {
  namedExports: {
    linkRegex: "REAL_LINK_REGEX_TRIGGER",
    linkParse: () => "LINK_MOCK",
  },
});

mock.module("./boldParser.ts", {
  namedExports: {
    boldRegex: "REAL_BOLD_REGEX_TRIGGER",
    boldParse: () => "BOLD_MOCK",
  },
});

mock.module("./italicParser.ts", {
  namedExports: {
    italicRegex: "REAL_ITALIC_REGEX_TRIGGER",
    italicParse: () => "ITALIC_MOCK",
  },
});

mock.module("./underlineParser.ts", {
  namedExports: {
    underlineRegex: "REAL_UNDERLINE_REGEX_TRIGGER",
    underlineParse: () => "UNDERLINE_MOCK",
  },
});

const { default: textParser } = await import("./textParser.ts");

describe("textParcer", () => {
  test("should sequentially replace trigger strings with simple mock strings", () => {
    const input =
      "   REAL_LINK_REGEX_TRIGGER REAL_BOLD_REGEX_TRIGGER REAL_ITALIC_REGEX_TRIGGER REAL_UNDERLINE_REGEX_TRIGGER   ";

    const expected = "LINK_MOCK BOLD_MOCK ITALIC_MOCK UNDERLINE_MOCK";

    const result = textParser(input);
    assert.equal(result, expected);
  });

  test("should return an empty string when given an empty string or spaces", () => {
    assert.equal(textParser(""), "");
    assert.equal(textParser("    "), "");
  });
});
