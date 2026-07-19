import { test, mock, afterEach, describe } from "node:test";
import assert from "node:assert";
import { type PostInfo } from "../types.ts";
import { productionPath, siteAddress, rssPostLimit } from "../../app-config.ts";

const mockCreateFile = mock.fn(async (path: string, content: string) => {
  return Promise.resolve();
});

mock.module("../file-utils/create-file.ts", {
  namedExports: { default: mockCreateFile },
});

describe("Test rss-feed.ts", () => {
  afterEach(() => {
    mockCreateFile.mock.resetCalls();
  });

  test("Ensure RSS generator compiles asynchronously, sorts, and writes valid feed XML to the root path", async () => {
    const testee = await import(`./rss-feed.ts?update=${Date.now()}`);

    const samplePosts: PostInfo[] = [
      {
        nameSlug: "older-post",
        creationDate: "2026-07-10",
        creationTime: "12:00",
        creationTimestamp: 1783684800000,
        name: "Older Post Entry",
        directory: "dir-1",
        blogDirectory: "/mock/prod/path/blog/2026-07-10",
        dateDirectory: "2026-07-10",
        blogPage: "/mock/prod/path/blog/2026-07-10/older-post.html",
        blogUrl: "/blog/2026-07-10/older-post.html",
        pageDescription: "Old post description.",
        postThumbDescription: "Thumb desc 1",
        pageImageDescription: "Image desc 1",
        author: "Alex Dev",
        publish: true,
      },
      {
        nameSlug: "newer-post",
        creationDate: "2026-07-12",
        creationTime: "14:00",
        creationTimestamp: 1783857600000,
        name: "Newer Post Entry",
        directory: "dir-2",
        blogDirectory: "/mock/prod/path/blog/2026-07-12",
        dateDirectory: "2026-07-12",
        blogPage: "/mock/prod/path/blog/2026-07-12/newer-post.html",
        blogUrl: "/blog/2026-07-12/newer-post.html",
        pageDescription: "New post description.",
        postThumbDescription: "Thumb desc 2",
        pageImageDescription: "Image desc 2",
        author: "Sam Code",
        publish: true,
      },
    ];

    await testee.default(samplePosts);

    assert.strictEqual(mockCreateFile.mock.callCount(), 1);

    const firstCall = mockCreateFile.mock.calls[0];
    const targetPath = firstCall.arguments[0];
    const generatedXml = firstCall.arguments[1];

    assert.strictEqual(targetPath, `${productionPath}/rss.xml`);

    assert.match(
      generatedXml,
      /<title><!\[CDATA\[Newer Post Entry\]\]><\/title>/,
    );
    assert.match(
      generatedXml,
      /<dc:creator><!\[CDATA\[Sam Code\]\]><\/dc:creator>/,
    );

    const escapedAddress = siteAddress.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expectedGuidPattern = new RegExp(
      `<guid isPermaLink="true">${escapedAddress}/blog/2026-07-12/newer-post\\.html</guid>`,
    );
    assert.match(generatedXml, expectedGuidPattern);

    const newerPostPosition = generatedXml.indexOf("Newer Post Entry");
    const olderPostPosition = generatedXml.indexOf("Older Post Entry");
    assert.ok(
      newerPostPosition < olderPostPosition,
      "RSS feed items must be ordered chronologically descending (newest first).",
    );
  });

  test("Ensure RSS generator respects the hard limit constraint max items boundary", async () => {
    const testee = await import(`./rss-feed.ts?update=${Date.now()}`);

    const totalTestPosts = rssPostLimit + 5;
    const largePostArray: PostInfo[] = Array.from(
      { length: totalTestPosts },
      (_, index) => ({
        nameSlug: `post-${index}`,
        creationDate: "2026-07-12",
        creationTime: "14:00",
        creationTimestamp: 1783857600000 + index,
        name: `Post Number ${index}`,
        directory: `dir-${index}`,
        blogDirectory: `${productionPath}/blog`,
        dateDirectory: "2026-07-12",
        blogPage: `${productionPath}/blog/post-${index}.html`,
        blogUrl: `/blog/post-${index}.html`,
        pageDescription: "Description string context.",
        postThumbDescription: "Thumb context.",
        pageImageDescription: "Image context.",
        author: "Author",
        publish: true,
      }),
    );

    await testee.default(largePostArray);

    const generatedXml = mockCreateFile.mock.calls[0].arguments[1];

    const totalItemsGenerated = (generatedXml.match(/<item>/g) || []).length;

    assert.strictEqual(
      totalItemsGenerated,
      rssPostLimit,
      `XML feed item count should be restricted to exactly ${rssPostLimit} elements.`,
    );
  });
});
