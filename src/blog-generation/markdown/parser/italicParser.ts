export const italicRegex = /\*(.*?)\*|_(.*?)_/g;

export const italicParse = (_: string, italic1: string, italic2: string) => {
  const content = italic1 || italic2;
  return `<em>${content}</em>`;
};
