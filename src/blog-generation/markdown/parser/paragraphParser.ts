import { escapeHtml } from "./escapeHtmlParser.ts";

export const paragraphRegex =
  /^(?![ \t]*<)(?![ \t]*$)(?![ \t]*[#*+\-])(?![ \t]*\d+[.)])([^\n]+)$/gm;

export const paragraphParse = (match: string): string =>
  `<p>${escapeHtml(match)}</p>`;
