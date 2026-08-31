// Matches the ENTIRE table block from the first row to the last row
export const tableRegex = /^((?:\|.+[^\n]*\n?)+)$/gm;

export const tableParse = (match: string): string => {
  // Split into individual rows and remove empty ones
  const rows = match
    .trim()
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  if (rows.length < 2) return match;

  let html = "<table>\n";
  let openBody = false;

  rows.forEach((row, index) => {
    // Check if the current row or next row is the delimiter row (e.g. |---|)
    const isDelimiter = /^[|\s-]+$/.test(row);
    if (isDelimiter) return; // Skip the delimiter row completely

    const cells = row
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

    // Look ahead to check if the next row is a delimiter (making this one a header)
    const nextRow = rows[index + 1];
    const isHeader = nextRow && /^[|\s-]+$/.test(nextRow.trim());

    if (isHeader) {
      html += "  <thead>\n    <tr>\n";
      cells.forEach((cell) => {
        html += `      <th>${cell}</th>\n`;
      });
      html += "    </tr>\n  </thead>\n";
    } else {
      if (!openBody) {
        html += "  <tbody>\n";
        openBody = true;
      }
      html += "    <tr>\n";
      cells.forEach((cell) => {
        html += `      <td>${cell}</td>\n`;
      });
      html += "    </tr>\n";
    }
  });

  if (openBody) {
    html += "  </tbody>\n";
  }
  html += "</table>";

  return html;
};
