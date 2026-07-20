export const orderedListRegex =
  /^[ \t]*\d+[.)]\s+.+(?:\n[ \t]*\d+[.)]\s+.+)*/gm;

export const orderedListParse = (match: string): string => {
  const lines = match.split("\n");
  let html = "<ol>\n";
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const lineMatch = lines[i].match(/^([ \t]*)\d+[.)]\s+(.+)$/);
    if (!lineMatch) continue;

    const [, indentation, content] = lineMatch;
    const currentIndent = indentation.replace(/\t/g, "  ").length;
    const lastIndent = indentStack[indentStack.length - 1];

    if (currentIndent > lastIndent) {
      indentStack.push(currentIndent);
      // Remove closing tag from previous line to nest this sub-list inside it cleanly
      html = html.trimEnd().replace(/<\/li>$/, "");
      html += "\n<ol>\n<li>" + content + "</li>";
    } else if (currentIndent < lastIndent) {
      while (
        indentStack.length > 1 &&
        currentIndent < indentStack[indentStack.length - 1]
      ) {
        indentStack.pop();
        html += "\n</ol>\n</li>";
      }
      html += "\n<li>" + content + "</li>";
    } else {
      html += (i === 0 ? "" : "\n") + "<li>" + content + "</li>";
    }
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    html += "\n</ol>\n</li>";
  }

  return html + "\n</ol>";
};
