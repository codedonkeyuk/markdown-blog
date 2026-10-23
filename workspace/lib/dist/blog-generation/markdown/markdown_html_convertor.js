import { paragraphRegex, paragraphParse } from "./parser/paragraphParser.js";
import { headerParse, headerRegex } from "./parser/headerParser.js";
import { imageParse, imageRegex } from "./parser/imageParser.js";
import { bulletListRegex, bulletListParse } from "./parser/bulletListParser.js";
import { orderedListRegex, orderedListParse, } from "./parser/orderedListParser.js";
import { tableParse, tableRegex } from "./parser/tableParser.js";
import { parseCodeBlocks } from "./parser/codeParser.js";
import asyncPool from "../thread-management/async-pool.js";
import appConfig from "../../app-config.js";
/**
 * Converts a markdown file to an HTML file. Follows the CommonMark standard \n\n for new section.
 * @param baseDirectory
 * @param markdown
 * @returns
 */
const markdownHtmlConvertor = async (baseDirectory, markdown) => {
    const rawHtml = await parseCodeBlocks(markdown);
    const blocks = rawHtml.split(/\n{2,}/);
    const { maxParallelProcesses } = appConfig;
    const processedBlocks = await asyncPool(blocks, maxParallelProcesses, async (block) => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock)
            return "";
        if (headerRegex.test(trimmedBlock)) {
            return trimmedBlock.replace(headerRegex, headerParse);
        }
        else if (tableRegex.test(trimmedBlock)) {
            return trimmedBlock.replace(tableRegex, tableParse);
        }
        else if (bulletListRegex.test(trimmedBlock)) {
            return trimmedBlock.replace(bulletListRegex, bulletListParse);
        }
        else if (orderedListRegex.test(trimmedBlock)) {
            return trimmedBlock.replace(orderedListRegex, orderedListParse);
        }
        else if (imageRegex.test(trimmedBlock)) {
            return trimmedBlock.replace(imageRegex, (_, altText, url) => imageParse(baseDirectory, _, altText, url));
        }
        else {
            return trimmedBlock.replace(paragraphRegex, paragraphParse);
        }
    });
    return processedBlocks.join("\n\n");
};
export default markdownHtmlConvertor;
//# sourceMappingURL=markdown_html_convertor.js.map