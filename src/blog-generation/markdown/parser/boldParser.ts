export const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;

export const boldParse = (_: string, bold1?: string, bold2?: string) => {
  const content = bold1 || bold2;
  return `<strong>${content}</strong>`;
};
