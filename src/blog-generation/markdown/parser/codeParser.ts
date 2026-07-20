import { codeToHtml } from "shiki";

export const codeBlockRegex = /^([`]{3,})([a-zA-Z0-9_\-]+)?\n([\s\S]*?)\n\1/gm;

export async function parseCodeBlocks(markdown: string): Promise<string> {
  codeBlockRegex.lastIndex = 0;

  let resultHtml = markdown;
  const matches = [...markdown.matchAll(codeBlockRegex)];

  for (const match of matches) {
    const fullBlockMatch = match[0];
    const language = match[2]?.trim() || "plaintext";
    const codeContent = match[3];

    try {
      const highlightedHtml = await codeToHtml(codeContent, {
        lang: language,
        theme: "github-dark-high-contrast",
      });

      const encodedCode = btoa(unescape(encodeURIComponent(codeContent)));

      const customWrapper = `
        <div class="code-block-container">
          <div class="code-block-body">
            ${highlightedHtml}
          </div>
          <div class="code-block-footer">
            <span class="code-lang-label">${language}</span>
            <button class="copy-btn" data-code="${encodedCode}">Copy</button>
          </div>
        </div>
      `;

      resultHtml = resultHtml.replace(fullBlockMatch, customWrapper);
    } catch (error) {
      const fallbackHtml = `<pre><code class="language-${language}">${codeContent}</code></pre>`;
      resultHtml = resultHtml.replace(fullBlockMatch, fallbackHtml);
    }
  }

  return resultHtml;
}
