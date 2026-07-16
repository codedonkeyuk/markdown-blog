import { type PostInfo } from "../types.ts";
import {
  productionPath,
  siteTitle,
  siteAddress,
  rssDescription,
  rssPostLimit,
} from "../../app-config.ts";
import createFile from "../file-utils/create-file.ts";

const rssFeed = async (posts: PostInfo[]): Promise<void> => {
  const sortedPosts = [...posts]
    .sort((a, b) => b.creationTimestamp - a.creationTimestamp)
    .slice(0, rssPostLimit);

  const rssItems = sortedPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.name}]]></title>
      <link>${siteAddress}${post.blogUrl}</link>
      <guid isPermaLink="true">${siteAddress}${post.blogUrl}</guid>
      <pubDate>${new Date(post.creationTimestamp).toUTCString()}</pubDate>
      <description><![CDATA[${post.pageDescription}]]></description>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
    </item>`,
    )
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom" 
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${siteAddress}</link>
    <description><![CDATA[${rssDescription}]]></description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteAddress}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  await createFile(`${productionPath}/rss.xml`, rssXml.trim());
};

export default rssFeed;
