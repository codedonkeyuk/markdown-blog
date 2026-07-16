export const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

export const linkParse = '<a href="$2" target="_blank" rel="noopener">$1</a>';
