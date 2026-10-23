export const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;

export const imageParse = (
  baseDirectory: string,
  _: string,
  altText?: string,
  url?: string,
) => {
  if (!url?.trim() || !altText?.trim()) {
    throw new Error(
      `Accessible image link missing either url (${url}), or altText (${altText}), or both`,
    );
  }
  const outputHtml = (altText: string, url: string) =>
    `<div class="post-image-frame"><img src="${url}" alt="${altText}" class="post-image"></div>`;

  const isRelative = !url.startsWith("/") && !/^https?:\/\//i.test(url);
  if (isRelative) {
    const relativeUrl = url.replace(/^\.\//, "");
    return outputHtml(altText, `${baseDirectory}${relativeUrl}`);
  }
  return outputHtml(altText, url);
};
