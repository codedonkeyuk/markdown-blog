import textParser from "./textParser.ts";

export const paragraphRegex =
  /^(?![ \t]*<)(?![ \t]*$)(?![ \t]*[#*+\-])(?![ \t]*\d+[.)])([^\n]+)$/gm;

export const paragraphParse = (match: string): string =>
  `<p>${textParser(match)}</p>`;
