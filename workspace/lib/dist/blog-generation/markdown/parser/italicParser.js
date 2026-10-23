export const italicRegex = /\*(.*?)\*|_(.*?)_/g;
export const italicParse = (_, italic1, italic2) => {
    const content = italic1 || italic2;
    return `<em>${content}</em>`;
};
//# sourceMappingURL=italicParser.js.map