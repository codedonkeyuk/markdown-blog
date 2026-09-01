export const escapeHtmlRegex = /[&<>"'/]/g;

export const escapeHtmlParse = (match: string): string => {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#47;",
  };

  return htmlEntities[match];
};

export const escapeHtml = (target: string): string =>
  target.trim().replace(escapeHtmlRegex, (m) => escapeHtmlParse(m));
