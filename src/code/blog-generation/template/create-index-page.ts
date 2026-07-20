import { type PostInfo } from "../types.ts";
import templateParameterRegex from "./template-parameter-regex.ts";
import appConfig from "../../app-config.ts";

const createIndexPage = (
  pageTemplate: string,
  posts: PostInfo[],
  pageNo: number,
  maxPage: number,
): string => {
  const { siteTitle, siteAddress } = appConfig();
  const pageNumber = pageNo + 1;
  const title = `${siteTitle} - Blog - Page ${pageNumber}`;
  const description = `List of Posts Page ${pageNumber}`;
  const postMatches = pageTemplate.match(templateParameterRegex("POSTS"));
  const navMatches = pageTemplate.match(templateParameterRegex("POSTS-NAV"));

  if (
    postMatches != null &&
    postMatches.length > 0 &&
    navMatches != null &&
    navMatches.length > 0
  ) {
    const postTemplate = postMatches[0].replace(
      /<!--INJECT\-POSTS\-START-->|<!--INJECT\-POSTS\-END-->/g,
      "",
    );

    const navigationTemplate = navMatches[0].replace(
      /<!--INJECT\-POSTS\-NAV\-START-->|<!--INJECT\-POSTS\-NAV\-END-->/g,
      "",
    );

    return pageTemplate
      .replace(templateParameterRegex("TITLE"), `<title>${title}</title>`)
      .replace(
        templateParameterRegex("META-OG-URL"),
        `<meta property="og:url" content="${siteAddress}/post/page${pageNumber}" />`,
      )
      .replace(
        templateParameterRegex("META-OG-TITLE"),
        `<meta property="og:title" content="${title}" />
    `,
      )
      .replace(
        templateParameterRegex("META-OG-DESCRIPTION"),
        `<meta property="og:description" content="${description}" />`,
      )
      .replace(
        templateParameterRegex("CANONICAL"),
        `<link rel="canonical" href="${siteAddress}/post/page${pageNumber}" />`,
      )
      .replace(templateParameterRegex("POSTS"), () =>
        posts
          .map((post) =>
            postTemplate
              .replaceAll(
                templateParameterRegex("POST-TEMPLATE-THUMBNAIL"),
                `
                <picture>
                  <source media="(max-width: 700px)" srcset="${post.dateDirectory}/post-image.svg" width="50" height="50" class="post__small-image">
                  <img src="${post.dateDirectory}/thumbnail.svg" width="1200" height="400" class="post__large-image" alt="${post.pageImageDescription}">
                </picture>
                `,
              )
              .replaceAll(
                templateParameterRegex("POST-TEMPLATE-HEADING"),
                `<a href="${post.blogUrl}"><h2>${post.name}</h2></a>`,
              )
              .replaceAll(
                templateParameterRegex("POST-TEMPLATE-DESCRIPTION"),
                post.pageDescription,
              )
              .replaceAll(
                templateParameterRegex("POST-TEMPLATE-AUTHOR"),
                post.author,
              )
              .replaceAll(
                templateParameterRegex("POST-TEMPLATE-DATE"),
                post.creationDate,
              )
              .replaceAll(
                templateParameterRegex("POST-TEMPLATE-TIME"),
                post.creationTime,
              ),
          )
          .join(""),
      )
      .replace(
        /<!--INJECT-POSTS-NAV-START-->([\s\S]*?)<!--INJECT-POSTS-NAV-END-->/s,
        () => {
          if (pageNo === 0 && maxPage == 1) {
            return "";
          }
          return navigationTemplate
            .replaceAll(
              templateParameterRegex("POSTS-NAV-PREV"),
              pageNo == 0 ? "" : `<a href="./page${pageNo}">Previous Page </a>`,
            )
            .replaceAll(
              templateParameterRegex("POSTS-NAV-NEXT"),
              pageNo + 1 >= maxPage
                ? ""
                : `<a href="./page${pageNo + 2}" disabled>Next Page </a>`,
            );
        },
      );
  } else {
    throw new Error("Post template tag and nav tags are required");
  }
};

export default createIndexPage;
