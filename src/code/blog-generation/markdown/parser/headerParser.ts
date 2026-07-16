export const headerRegex = /^(#+)\s+(.*)$/gm;

export const headerParse = (_: string, hashes: string, content: string) => {
  const level = hashes.length;
  if (level === 1) {
    throw Error(
      "Header 1 (<H1>) is generated from post entry. Only H2+ is supported.",
    );
  }
  return `<h${level}>${content}</h${level}>`;
};
