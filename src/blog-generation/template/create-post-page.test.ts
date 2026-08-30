import { test, mock } from "node:test";
import assert from "node:assert";
import { type PostInfo } from "../types.ts";

mock.module("../../app-config.ts", {
  namedExports: {
    default: {
      siteAddress: "https://myblog.com",
      blogPath: "posts",
      siteTitle: "My Awesome Blog",
    },
  },
});

mock.module("../markdown/markdown_html_convertor.ts", {
  namedExports: {
    default: async (baseDir: string, content: string) => {
      return `<p>Rendered: ${content}</p>`;
    },
  },
});

test("createPostPage correctly replaces HTML comment template tags", async () => {
  const { default: createPostPage } = await import("./create-post-page.ts");

  const pageTemplate = `
    <html>
      <head>
        <!--INJECT-META-OG-URL-START--><!--INJECT-META-OG-URL-END-->
        <!--INJECT-META-OG-TITLE-START--><!--INJECT-META-OG-TITLE-END-->
        <!--INJECT-META-OG-DESCRIPTION-START--><!--INJECT-META-OG-DESCRIPTION-END-->
        <!--INJECT-META-DESCRIPTION-START--><!--INJECT-META-DESCRIPTION-END-->
        <!--INJECT-META-OG-IMAGE-START--><!--INJECT-META-OG-IMAGE-END-->
        <!--INJECT-POST-CANONICAL-START--><!--INJECT-POST-CANONICAL-END-->
        <!--INJECT-POST-TITLE-START--><!--INJECT-POST-TITLE-END-->
      </head>
      <body>
        <h1><!--INJECT-POST-HEADING-START--><!--INJECT-POST-HEADING-END--></h1>
        <!--INJECT-POST-IMAGE-START--><!--INJECT-POST-IMAGE-END-->
        <span><!--INJECT-POST-DATE-START--><!--INJECT-POST-DATE-END--></span>
        <span><!--INJECT-POST-TIME-START--><!--INJECT-POST-TIME-END--></span>
        <span><!--INJECT-POST-AUTHOR-START--><!--INJECT-POST-AUTHOR-END--></span>
        <main><!--INJECT-POST-CONTENT-START--><!--INJECT-POST-CONTENT-END--></main>
      </body>
    </html>
  `;

  const mockPostInfo: PostInfo = {
    creationDate: "30 August 2026",
    creationTime: "16:00",
    creationTimestamp: 1788105600000,
    name: "My First Post",
    nameSlug: "my-first-post",
    pageDescription: "A great post about coding.",
    postThumbDescription: "Thumbnail image description",
    author: "Jane Doe",
    publish: true,
    dateDirectory: "2026/08",
    blogUrl: "/posts/my-first-post",
    blogDirectory: "posts/2026/08/my-first-post",
    directory: "content/posts/2026/08/my-first-post",
    blogPage: "index.html",
  };

  const mockPostContent = "Hello World";

  const result = await createPostPage(
    pageTemplate,
    mockPostContent,
    mockPostInfo,
  );

  assert.match(
    result,
    /<meta property="og:url" content="https:\/\/myblog\.com\/posts\/my-first-post"/,
  );
  assert.match(result, /<meta property="og:title" content="My First Post"/);
  assert.match(
    result,
    /<meta property="og:description" content="A great post about coding\."/,
  );
  assert.match(
    result,
    /<meta property="description" content="A great post about coding\."/,
  );
  assert.match(
    result,
    /<meta property="og:image" content="\/posts\/2026\/08\/social-image\.png"/,
  );
  assert.match(
    result,
    /<link rel="canonical" href="https:\/\/myblog\.com\/posts\/my-first-post"/,
  );
  assert.match(result, /<title>My Awesome Blog - My First Post<\/title>/);
  assert.match(result, /<h1>My First Post<\/h1>/);
  assert.match(
    result,
    /<img src="\/posts\/2026\/08\/post-image\.svg" alt="Thumbnail image description"/,
  );
  assert.match(result, /<span>30 August 2026<\/span>/);
  assert.match(result, /<span>16:00<\/span>/);
  assert.match(result, /<span>Jane Doe<\/span>/);
  assert.match(result, /<main><p>Rendered: Hello World<\/p><\/main>/);
});
