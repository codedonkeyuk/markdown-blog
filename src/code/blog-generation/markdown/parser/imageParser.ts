export const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;

export const imageParse = (_: string, altText?: string, url?: string) => {
  if (!url?.trim() || !altText?.trim()) {
    throw new Error(
      `Accessible image link missing either url (${url}), or altText (${altText}), or both`,
    );
  }
  return `<img src="${url}" alt="${altText}">`;
};
