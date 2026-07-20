import { boldRegex, boldParse } from "./parser/boldParser.ts";
import { underlineRegex, underlineParse } from "./parser/underlineParser.ts";
import { italicRegex, italicParse } from "./parser/italicParser.ts";
import { linkRegex, linkParse } from "./parser/linkParser.ts";
import { paragraphRegex, paragraphParse } from "./parser/paragraphParser.ts";
import { headerParse, headerRegex } from "./parser/headerParser.ts";
import { imageParse, imageRegex } from "./parser/imageParser.ts";
import { bulletListRegex, bulletListParse } from "./parser/bulletListParser.ts";
import {
  orderedListRegex,
  orderedListParse,
} from "./parser/orderedListParser.ts";
import { parseCodeBlocks } from "./parser/codeParser.ts";

const markdownHtmlConvertor = async (markdown: string): Promise<string> => {
  // 1. Process Shiki code fences completely first
  let html = await parseCodeBlocks(markdown);

  // 2. Process structural layout blocks globally so list groups stay unified
  html = html
    .replace(headerRegex, headerParse)
    .replace(orderedListRegex, orderedListParse)
    .replace(bulletListRegex, bulletListParse);

  // 3. Separate the text elements to process paragraphs line-by-line safely
  return (
    html
      .split(/\r?\n/)
      .map((paragraph) => {
        return (
          paragraph
            // Line-based formatting structures
            .replace(paragraphRegex, paragraphParse)
            .replace(imageRegex, imageParse)
            .replace(linkRegex, linkParse)
            .replace(boldRegex, boldParse)
            .replace(italicRegex, italicParse)
            .replace(underlineRegex, underlineParse)
        );
      })
      // Join back with standard newlines to keep your layout presentation intact
      .join("\n")
  );
};

export default markdownHtmlConvertor;
