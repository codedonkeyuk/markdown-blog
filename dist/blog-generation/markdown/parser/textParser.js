import { boldRegex, boldParse } from "./boldParser.js";
import { italicRegex, italicParse } from "./italicParser.js";
import { underlineRegex, underlineParse } from "./underlineParser.js";
import { linkRegex, linkParse } from "./linkParser.js";
/**
 * Links, bold, italic, special characters etc can exist within tables,
 * bullet points and paragraphs.
 * This is a helper function that can be called within the larger parsers.
 * @param match mrakdownString
 * @returns htmlString
 */
const textParser = (match) => match
    .trim()
    .replace(linkRegex, linkParse)
    .replace(boldRegex, boldParse)
    .replace(italicRegex, italicParse)
    .replace(underlineRegex, underlineParse);
export default textParser;
//# sourceMappingURL=textParser.js.map