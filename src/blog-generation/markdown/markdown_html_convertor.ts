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
import { tableParse, tableRegex } from "./parser/tableParser.ts";
import { parseCodeBlocks } from "./parser/codeParser.ts";

const markdownHtmlConvertor = async (
  baseDirectory: string,
  markdown: string,
): Promise<string> => {
  let html = await parseCodeBlocks(markdown);

  html = html
    .replace(headerRegex, headerParse)
    .replace(orderedListRegex, orderedListParse)
    .replace(bulletListRegex, bulletListParse)
    .replace(tableRegex, tableParse);

  return html
    .split(/\r?\n/)
    .map((paragraph) => {
      const trimmed = paragraph.trim();

      if (
        trimmed.startsWith("<table") ||
        trimmed.startsWith("</table") ||
        trimmed.startsWith("<thead") ||
        trimmed.startsWith("</thead") ||
        trimmed.startsWith("<tbody") ||
        trimmed.startsWith("</tbody") ||
        trimmed.startsWith("<tr") ||
        trimmed.startsWith("</tr") ||
        trimmed.startsWith("<th") ||
        trimmed.startsWith("<td")
      ) {
        return paragraph;
      }

      return paragraph
        .replace(paragraphRegex, paragraphParse)
        .replace(imageRegex, (_: string, altText?: string, url?: string) =>
          imageParse(baseDirectory, _, altText, url),
        )
        .replace(linkRegex, linkParse)
        .replace(boldRegex, boldParse)
        .replace(italicRegex, italicParse)
        .replace(underlineRegex, underlineParse);
    })
    .join("\n");
};

export default markdownHtmlConvertor;
