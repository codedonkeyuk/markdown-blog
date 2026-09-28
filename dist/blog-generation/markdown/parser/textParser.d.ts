/**
 * Links, bold, italic, special characters etc can exist within tables,
 * bullet points and paragraphs.
 * This is a helper function that can be called within the larger parsers.
 * @param match mrakdownString
 * @returns htmlString
 */
declare const textParser: (match: string) => string;
export default textParser;
