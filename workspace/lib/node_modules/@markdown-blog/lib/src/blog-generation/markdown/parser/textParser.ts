import { boldRegex, boldParse } from "./boldParser.ts";
import { italicRegex, italicParse } from "./italicParser.ts";
import { underlineRegex, underlineParse } from "./underlineParser.ts";
import { linkRegex, linkParse } from "./linkParser.ts";

/**
 * Links, bold, italic, special characters etc can exist within tables,
 * bullet points and paragraphs.
 * This is a helper function that can be called within the larger parsers.
 * @param match mrakdownString
 * @returns htmlString
 */

const textParser = (match: string) =>
  match
    .trim()
    .replace(linkRegex, linkParse)
    .replace(boldRegex, boldParse)
    .replace(italicRegex, italicParse)
    .replace(underlineRegex, underlineParse);

export default textParser;
