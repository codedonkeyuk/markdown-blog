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

/**
 * Converts a markdown file to an HTML file. Follows the CommonMark standard \n\n for new section.
 * @param baseDirectory
 * @param markdown
 * @returns
 */
const markdownHtmlConvertor = async (
  baseDirectory: string,
  markdown: string,
): Promise<string> => {
  const rawHtml = await parseCodeBlocks(markdown);

  const blocks = rawHtml.split(/\n{2,}/);
  const processedBlocks: string[] = [];

  for (const block of blocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    if (headerRegex.test(trimmedBlock)) {
      processedBlocks.push(trimmedBlock.replace(headerRegex, headerParse));
    } else if (tableRegex.test(trimmedBlock)) {
      processedBlocks.push(trimmedBlock.replace(tableRegex, tableParse));
    } else if (bulletListRegex.test(trimmedBlock)) {
      processedBlocks.push(
        trimmedBlock.replace(bulletListRegex, bulletListParse),
      );
    } else if (orderedListRegex.test(trimmedBlock)) {
      processedBlocks.push(
        trimmedBlock.replace(orderedListRegex, orderedListParse),
      );
    } else if (imageRegex.test(trimmedBlock)) {
      processedBlocks.push(
        trimmedBlock.replace(imageRegex, (_, altText, url) =>
          imageParse(baseDirectory, _, altText, url),
        ),
      );
    } else {
      processedBlocks.push(
        trimmedBlock.replace(paragraphRegex, paragraphParse),
      );
    }
  }

  return processedBlocks.join("\n\n");
};

export default markdownHtmlConvertor;
