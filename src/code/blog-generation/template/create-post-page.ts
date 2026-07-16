import { type PostInfo } from "../types.ts";
import markdownHtmlConvertor from "../markdown/markdown_html_convertor.ts";
import { siteTitle, siteAddress, blogPath } from "../../app-config.ts";
import templateParameterRegex from "./template-parameter-regex.ts";

const createPostPage = async (
  pageTemplate: string,
  postContent: string,
  postInfo: PostInfo,
): Promise<string> => {
  const baseDirectory = `${siteAddress}/${blogPath}/${postInfo.dateDirectory}/`;

  const renderedPostHtml = await markdownHtmlConvertor(postContent);

  return pageTemplate
    .replace(
      templateParameterRegex("META-OG-URL"),
      `<meta property="og:url" content="${siteAddress}${postInfo.blogUrl}" />`,
    )
    .replace(
      templateParameterRegex("META-OG-TITLE"),
      `<meta property="og:title" content="${postInfo.name}" />
    `,
    )
    .replace(
      templateParameterRegex("META-OG-DESCRIPTION"),
      `<meta property="og:description" content="${postInfo.pageDescription}" />`,
    )
    .replace(
      templateParameterRegex("META-OG-IMAGE"),
      `<meta property="og:image" content="${baseDirectory}social-image.png" />`,
    )
    .replace(
      templateParameterRegex("POST-CANONICAL"),
      `<link rel="canonical" href="${siteAddress}${postInfo.blogUrl}" />`,
    )
    .replace(
      templateParameterRegex("POST-TITLE"),
      `<title>${siteTitle} - ${postInfo.name}</title>`,
    )
    .replace(templateParameterRegex("POST-HEADING"), postInfo.name)
    .replace(
      templateParameterRegex("POST-IMAGE"),
      `<img src="./post-image.svg" alt="${postInfo.postThumbDescription}" width="1200" height="400"/>`,
    )
    .replace(templateParameterRegex("POST-DATE"), postInfo.creationDate)
    .replace(templateParameterRegex("POST-TIME"), postInfo.creationTime)
    .replace(templateParameterRegex("POST-AUTHOR"), postInfo.author)
    .replace(templateParameterRegex("POST-CONTENT"), renderedPostHtml);
};

export default createPostPage;
