import textParser from "./textParser.js";
export const paragraphRegex = /^([\s\S]+)$/;
export const paragraphParse = (match) => `<p>${textParser(match.trim())}</p>`;
//# sourceMappingURL=paragraphParser.js.map