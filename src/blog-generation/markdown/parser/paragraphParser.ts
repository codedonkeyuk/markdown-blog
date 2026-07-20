export const paragraphRegex =
  /^(?![ \t]*<)(?![ \t]*$)(?![ \t]*[#*+\-])(?![ \t]*\d+[.)])([^\n]+)$/gm;

export const paragraphParse = "<p>$1</p>";
