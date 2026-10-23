import textParser from "./textParser.ts";

export const paragraphRegex = /^([\s\S]+)$/;

export const paragraphParse = (match: string): string =>
  `<p>${textParser(match.trim())}</p>`;
