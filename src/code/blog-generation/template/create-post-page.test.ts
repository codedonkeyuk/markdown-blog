import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";
import { type PostInfo } from "../types.ts";
import { siteTitle } from "../../app-config.ts";

describe("Test create-post-page.ts", async () => {
  const markdownHtmlConvertorMock = mock.fn();

  beforeEach(async () => {
    markdownHtmlConvertorMock.mock.mockImplementation(
      (input: string) => `<p>${input}</p>` as any,
    );
    mock.module("../markdown/markdown_html_convertor.ts", {
      defaultExport: markdownHtmlConvertorMock,
    });
  });

  afterEach(() => {
    markdownHtmlConvertorMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure post title, date, and content are injected correctly", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-META-OG-URL-START-->
        <!--INJECT-META-OG-URL-END-->
        <!--INJECT-META-OG-TITLE-START-->
        <!--INJECT-META-OG-TITLE-END-->
        <!--INJECT-META-OG-DESCRIPTION-START-->
        <!--INJECT-META-OG-DESCRIPTION-END-->
        <!--INJECT-META-OG-IMAGE-START-->
        <!--INJECT-META-OG-IMAGE-END-->
        <!--INJECT-POST-TITLE-START-->
        <!--INJECT-POST-TITLE-END-->
        <!--INJECT-POST-DATE-START-->
        <!--INJECT-POST-DATE-END-->
        <!--INJECT-POST-TIME-START-->
        <!--INJECT-POST-TIME-END-->
        <!--INJECT-POST-IMAGE-START-->
        <!--INJECT-POST-IMAGE-END-->
        <!--INJECT-POST-AUTHOR-START-->
        <!--INJECT-POST-AUTHOR-END-->
        <!--INJECT-POST-CONTENT-START-->
        <!--INJECT-POST-CONTENT-END-->
        <!--INJECT-POST-CANONICAL-START-->
        <!--INJECT-POST-CANONICAL-END-->
      </html>
    `;
    const postContent = "Hello world";
    const postInfo: PostInfo = {
      name: "Test Post",
      nameSlug: "",
      creationDate: new Date("2023-01-02").toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      creationTime: new Date("2023-01-02").toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      creationTimestamp: new Date("2023-01-02").getTime(),
      blogDirectory: "",
      dateDirectory: "2023-01-02",
      directory: "",
      blogPage: "",
      blogUrl: "",
      pageDescription: "This is a description",
      postThumbDescription: "This is a post image",
      pageImageDescription: "This is a page image",
      author: "Joe Bloggs",
    };

    const testee = await import("./create-post-page.ts");
    const result = await testee.default(pageTemplate, postContent, postInfo);

    assert(
      result.includes(
        '<meta property="og:url" content="http://localhost:3001" />',
      ),
    );
    assert(result.includes('<meta property="og:title" content="Test Post" />'));
    assert(
      result.includes(
        '<meta property="og:description" content="This is a description" />',
      ),
    );
    assert(
      result.includes(
        '<meta property="og:image" content="http://localhost:3001/blog/2023-01-02/social-image.png" />',
      ),
    );
    assert(
      result.includes('<link rel="canonical" href="http://localhost:3001" />'),
    );
    assert(result.includes("<title>Markdown Blog - Test Post</title>"));

    assert(result.includes(`${siteTitle} - Test Post`));
    assert(result.includes("Monday, 2 January 2023"));
    assert(result.includes("12:00:00 am"));
    assert(result.includes("Joe Bloggs"));
    assert(
      result.includes(
        '<img src="./post-image.svg" alt="This is a post image" width="1200" height="400"/>',
      ),
    );
    assert(result.includes("<p>Hello world</p>"));
    assert.strictEqual(markdownHtmlConvertorMock.mock.callCount(), 1);
    assert.strictEqual(
      markdownHtmlConvertorMock.mock.calls[0].arguments[0],
      postContent,
    );
  });
});
