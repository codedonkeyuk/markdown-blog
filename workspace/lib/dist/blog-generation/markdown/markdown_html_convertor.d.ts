/**
 * Converts a markdown file to an HTML file. Follows the CommonMark standard \n\n for new section.
 * @param baseDirectory
 * @param markdown
 * @returns
 */
declare const markdownHtmlConvertor: (baseDirectory: string, markdown: string) => Promise<string>;
export default markdownHtmlConvertor;
