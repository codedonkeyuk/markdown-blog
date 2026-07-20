import assert from "node:assert";
import { describe, test } from "node:test";
import { type PostInfo } from "../types.ts";

describe("Test create-index-page.ts", async () => {
  const testee = await import("./create-index-page.ts");

  test("Ensure posts are injected correctly", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-META-OG-URL-START--><!--INJECT-META-OG-URL-END-->
        <!--INJECT-META-OG-TITLE-START--><!--INJECT-META-OG-TITLE-END-->
        <!--INJECT-META-OG-DESCRIPTION-START--><!--INJECT-META-OG-DESCRIPTION-END-->
        <!--INJECT-TITLE-START--><!--INJECT-TITLE-END-->
        <!--INJECT-POSTS-START-->
          <!--INJECT-POST-TEMPLATE-THUMBNAIL-START--><!--INJECT-POST-TEMPLATE-THUMBNAIL-END-->
          <!--INJECT-POST-TEMPLATE-HEADING-START--><!--INJECT-POST-TEMPLATE-HEADING-END-->
          <!--INJECT-POST-TEMPLATE-DESCRIPTION-START--><!--INJECT-POST-TEMPLATE-DESCRIPTION-END-->
          <!--INJECT-POST-TEMPLATE-AUTHOR-START--><!--INJECT-POST-TEMPLATE-AUTHOR-END-->
          <!--INJECT-POST-TEMPLATE-DATE-START--><!--INJECT-POST-TEMPLATE-DATE-END-->
          <!--INJECT-POST-TEMPLATE-TIME-START--><!--INJECT-POST-TEMPLATE-TIME-END-->
        <!--INJECT-POSTS-END-->
        <!--INJECT-POSTS-NAV-START-->
          <!--INJECT-POSTS-NAV-NEXT-START-->
          <!--INJECT-POSTS-NAV-NEXT-END-->
          <!--INJECT-POSTS-NAV-PREV-START-->
          <!--INJECT-POSTS-NAV-PREV-END-->
        <!--INJECT-POSTS-NAV-END-->
        <!--INJECT-CANONICAL-START-->
        <!--INJECT-CANONICAL-END-->
      </html>
    `;
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "",
        creationDate: "2012-12-11",
        creationTime: "11:00:00 am",
        creationTimestamp: 12345,
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "Post one page description",
        postThumbDescription: "",
        pageImageDescription: "Post one thumbnail description",
        author: "",
        publish: true,
      },
      {
        name: "Post 2",
        nameSlug: "",
        creationDate: "2012-12-12",
        creationTime: "12:00:00 am",
        creationTimestamp: 6789,
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "Post two page description",
        postThumbDescription: "",
        pageImageDescription: "Post two thumbnail description",
        author: "",
        publish: true,
      },
    ];
    const result = testee.default(pageTemplate, posts, 0, 1);

    assert(
      result.includes(
        '<meta property="og:url" content="http://localhost:3001/post/page1" />',
      ),
    );
    assert(
      result.includes(
        '<meta property="og:title" content="Markdown Blog - Blog - Page 1" />',
      ),
    );
    assert(
      result.includes(
        '<meta property="og:description" content="List of Posts Page 1" />',
      ),
    );
    assert(result.includes("<title>Markdown Blog - Blog - Page 1</title>"));
    assert(
      result.includes(
        `<link rel="canonical" href="http://localhost:3001/post/page1" />`,
      ),
    );

    assert.match(
      result,
      /<picture>\s*<source\s+media="\(max-width:\s*700px\)"\s+srcset="\/post-image\.svg"\s+width="50"\s+height="50"\s+class="post__small-image">\s*<img\s+src="\/thumbnail\.svg"\s+width="1200"\s+height="400"\s+class="post__large-image"\s+alt="Post one thumbnail description">\s*<\/picture>/,
    );
    assert(result.includes("<h2>Post 1</h2>"));
    assert(result.includes("Post one page description"));
    assert(result.includes("Post one thumbnail description"));

    assert.match(
      result,
      /<picture>\s*<source\s+media="\(max-width:\s*700px\)"\s+srcset="\/post-image\.svg"\s+width="50"\s+height="50"\s+class="post__small-image">\s*<img\s+src="\/thumbnail\.svg"\s+width="1200"\s+height="400"\s+class="post__large-image"\s+alt="Post two thumbnail description">\s*<\/picture>/,
    );
    assert(result.includes("<h2>Post 2</h2>"));
    assert(result.includes("Post two page description"));
    assert(result.includes("Post two thumbnail description"));
  });

  test("Ensure navigation is injected correctly for first page", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-START--><!--INJECT-POSTS-END-->
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-NEXT-START-->
        <!--INJECT-POSTS-NAV-NEXT-END-->
        <!--INJECT-POSTS-NAV-PREV-START-->
        <!--INJECT-POSTS-NAV-PREV-END-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 0, 2);

    assert(result.includes('<a href="./page2" disabled>Next Page </a>'));
    assert(!result.includes("Previous Page"));
  });

  test("Ensure navigation is injected correctly for last page", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-START--><!--INJECT-POSTS-END-->
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-NEXT-START-->
        <!--INJECT-POSTS-NAV-NEXT-END-->
        <!--INJECT-POSTS-NAV-PREV-START-->
        <!--INJECT-POSTS-NAV-PREV-END-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 1, 2);

    assert(result.includes('<a href="./page1">Previous Page </a>'));
    assert(!result.includes("Next Page"));
  });

  test("Ensure navigation is injected correctly for middle page", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-START--><!--INJECT-POSTS-END-->
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-NEXT-START-->
        <!--INJECT-POSTS-NAV-NEXT-END-->
        <!--INJECT-POSTS-NAV-PREV-START-->
        <!--INJECT-POSTS-NAV-PREV-END-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 1, 4);

    assert(result.includes('<a href="./page1">Previous Page </a>'));
    assert(result.includes('<a href="./page3" disabled>Next Page </a>'));
  });

  test("Ensure empty posts result in no articles", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-START-->
        <!--INJECT-POSTS-END-->
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 0, 1);

    assert(!result.includes("<article>"));
  });
});
