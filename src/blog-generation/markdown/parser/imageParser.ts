export const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;

export const imageParse = (_: string, altText?: string, url?: string) => {
  if (!url?.trim() || !altText?.trim()) {
    throw new Error(
      `Accessible image link missing either url (${url}), or altText (${altText}), or both`,
    );
  }
  return `<div class="post-image-frame"><img src="${url}" alt="${altText}" class="post-image"></div>`;
};
