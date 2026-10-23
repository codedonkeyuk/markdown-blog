export const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
export const boldParse = (_, bold1, bold2) => {
    const content = bold1 || bold2;
    return `<strong>${content}</strong>`;
};
//# sourceMappingURL=boldParser.js.map