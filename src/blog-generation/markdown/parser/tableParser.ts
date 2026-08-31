export const tableRegex = /^((?:\|.+[^\n]*\n?)+)$/gm;

export const tableParse = (match: string): string => {
  const rows = match
    .trim()
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  if (rows.length < 2) return match;

  // Filter out the syntax line (e.g., |---|---|) completely right away
  const cleanRows = rows.filter((row) => !/^[|\s-]+$/.test(row));
  if (cleanRows.length === 0) return match;

  let html = "<table>\n";

  // 1. Handle the Header Row
  const headerRow = cleanRows.shift();
  if (headerRow) {
    const headers = headerRow
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
    html += "  <thead>\n    <tr>\n";
    headers.forEach((cell) => {
      html += `      <th>${cell}</th>\n`;
    });
    html += "    </tr>\n  </thead>\n";
  }

  // 2. Handle the Data Rows
  if (cleanRows.length > 0) {
    html += "  <tbody>\n";
    cleanRows.forEach((row) => {
      const cells = row
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());
      html += "    <tr>\n";
      cells.forEach((cell) => {
        html += `      <td>${cell}</td>\n`;
      });
      html += "    </tr>\n";
    });
    html += "  </tbody>\n";
  }

  html += "</table>";
  return html;
};
