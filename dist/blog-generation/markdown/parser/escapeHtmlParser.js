export const escapeHtmlRegex = /[&<>"'/]/g;
export const escapeHtmlParse = (match) => {
    const htmlEntities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#47;",
    };
    return htmlEntities[match];
};
export const escapeHtml = (target) => target.trim().replace(escapeHtmlRegex, (m) => escapeHtmlParse(m));
//# sourceMappingURL=escapeHtmlParser.js.map