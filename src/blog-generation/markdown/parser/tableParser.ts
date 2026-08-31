export const tableRegex = /^((?:\|.+[^\n]*\n?)+)$/gm;

export const tableParse = (match: string): string => {
  const rows = match
    .trim()
    .split("\n")
    .map((r) => r.trim());

  const populatedRows = rows.filter((row) => {
    const content = row.replace(/[|\s]/g, "");
    return content.length > 0;
  });

  if (populatedRows.length < 2) return match;

  let html = '<div class="table-wrapper">\n<table>\n';
  html += "  <thead>\n    <tr>\n";

  const headerRow = populatedRows[0];
  const headers = headerRow
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
  headers.forEach((cell) => {
    html += `      <th>${cell}</th>\n`;
  });
  html += "    </tr>\n  </thead>\n";

  if (populatedRows.length > 2) {
    html += "  <tbody>\n";

    for (let i = 2; i < populatedRows.length; i++) {
      const row = populatedRows[i];
      const cells = row
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());

      html += "    <tr>\n";
      cells.forEach((cell) => {
        html += `      <td>${cell}</td>\n`;
      });
      html += "    </tr>\n";
    }

    html += "  </tbody>\n";
  }

  html += "</table>\n</div>";
  return html;
};
