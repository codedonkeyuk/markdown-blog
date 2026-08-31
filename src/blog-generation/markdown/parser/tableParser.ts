export const tableRegex = /^((?:\|.+[^\n]*\n?)+)$/gm;

export const tableParse = (match: string): string => {
  // 1. Split into individual rows and clean up whitespace
  const rows = match
    .trim()
    .split("\n")
    .map((r) => r.trim());

  // 2. Filter out any remaining blank lines
  const populatedRows = rows.filter((row) => {
    const content = row.replace(/[|\s]/g, "");
    return content.length > 0;
  });

  if (populatedRows.length < 2) return match;

  let html = "<table>\n";
  html += "  <thead>\n    <tr>\n";

  // 3. The first row (index 0) is always the header
  const headerRow = populatedRows[0];
  const headers = headerRow
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
  headers.forEach((cell) => {
    html += `      <th>${cell}</th>\n`;
  });
  html += "    </tr>\n  </thead>\n";

  // 4. Process all remaining data rows into <tbody>
  // Start from index 2 to skip the separator row (|---|---|) at index 1
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

  html += "</table>";
  return html;
};
