import {} from "../types.js";
import appConfig from "../../app-config.js";
import createFile from "../file-utils/create-file.js";
const rssFeed = async (posts) => {
    const { siteAddress, siteTitle, rssDescription, productionPath, rssPostLimit, } = appConfig;
    const sortedPosts = [...posts]
        .sort((a, b) => b.creationTimestamp - a.creationTimestamp)
        .slice(0, rssPostLimit);
    const rssItems = sortedPosts
        .map((post) => `
    <item>
      <title><![CDATA[${post.name}]]></title>
      <link>${siteAddress}${post.blogUrl}</link>
      <guid isPermaLink="true">${siteAddress}${post.blogUrl}</guid>
      <pubDate>${new Date(post.creationTimestamp).toUTCString()}</pubDate>
      <description><![CDATA[${post.pageDescription}]]></description>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
    </item>`)
        .join("");
    const lastBuildDateTag = sortedPosts.length > 0
        ? `\n    <lastBuildDate>${new Date(sortedPosts[0].creationTimestamp).toUTCString()}</lastBuildDate>`
        : "";
    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://w3.org" 
  xmlns:dc="http://purl.org">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${siteAddress}</link>
    <description><![CDATA[${rssDescription}]]></description>${lastBuildDateTag}
    <atom:link href="${siteAddress}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;
    await createFile(`${productionPath}/rss.xml`, rssXml.trim());
};
export default rssFeed;
//# sourceMappingURL=rss-feed.js.map