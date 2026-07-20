import assert from "node:assert";
import { type PostInfo } from "./types.ts";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test app.ts", () => {
  const posts: PostInfo[] = [
    {
      nameSlug: "Post",
      creationDate: "2012-12-12",
      creationTime: "12:00:00 am",
      creationTimestamp: 12345,
      name: "Post",
      blogDirectory: "2012-12-12/post",
      dateDirectory: "2012-12-12",
      directory: "2012-12-12/post",
      blogPage: "2012-12-12/post/post",
      blogUrl: "./2012-12-12/post/post",
      pageDescription: "A simple description",
      postThumbDescription: "thumbnail description",
      pageImageDescription: "page images description",
      author: "Joe Bloggs",
      publish: true,
    },
  ];

  const deleteDirContentsMock = mock.fn(async () => {});
  const copyFolderContentsMock = mock.fn(async () => {});
  const generatePostInfoMock = mock.fn<() => Promise<PostInfo[]>>(
    async () => [],
  );
  const generatePostPagesMock = mock.fn(async () => {});
  const generateIndexesMock = mock.fn(async () => {});
  const minifySiteMock = mock.fn(async () => {});
  const injectServiceWorkerMock = mock.fn(async () => {});
  const rssFeedMock = mock.fn(async () => {});

  beforeEach(() => {
    mock.module("./file-utils/delete-dir-contents.ts", {
      namedExports: { default: deleteDirContentsMock },
    });
    mock.module("./file-utils/copy-folder-contents.ts", {
      namedExports: { default: copyFolderContentsMock },
    });
    mock.module("./template/generate-post-info.ts", {
      namedExports: { default: generatePostInfoMock },
    });
    mock.module("./template/generate-post-pages.ts", {
      namedExports: { default: generatePostPagesMock },
    });
    mock.module("./template/generate-indexes.ts", {
      namedExports: { default: generateIndexesMock },
    });
    mock.module("./compression/minify-site.ts", {
      namedExports: { default: minifySiteMock },
    });
    mock.module("./service-worker/inject-service-worker.ts", {
      namedExports: { default: injectServiceWorkerMock },
    });
    mock.module("./rss/rss-feed.ts", {
      namedExports: { default: rssFeedMock },
    });
  });

  afterEach(() => {
    deleteDirContentsMock.mock.resetCalls();
    copyFolderContentsMock.mock.resetCalls();
    generatePostInfoMock.mock.resetCalls();
    generatePostPagesMock.mock.resetCalls();
    generateIndexesMock.mock.resetCalls();
    minifySiteMock.mock.resetCalls();
    injectServiceWorkerMock.mock.resetCalls();
    rssFeedMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure app calls the correct mocked methods", async () => {
    deleteDirContentsMock.mock.mockImplementation(async () => {});
    copyFolderContentsMock.mock.mockImplementation(async () => {});
    generatePostInfoMock.mock.mockImplementation(async () => posts);
    generatePostPagesMock.mock.mockImplementation(async () => {});
    generateIndexesMock.mock.mockImplementation(async () => {});
    minifySiteMock.mock.mockImplementation(async () => {});
    injectServiceWorkerMock.mock.mockImplementation(async () => {});
    rssFeedMock.mock.mockImplementation(async () => {});

    await import(`./app.ts`);

    assert.strictEqual(deleteDirContentsMock.mock.callCount(), 2);
    assert.strictEqual(copyFolderContentsMock.mock.callCount(), 1);
    assert.strictEqual(generatePostInfoMock.mock.callCount(), 1);
    assert.strictEqual(generatePostPagesMock.mock.callCount(), 1);
    assert.strictEqual(generateIndexesMock.mock.callCount(), 1);
    assert.strictEqual(minifySiteMock.mock.callCount(), 1);
    assert.strictEqual(injectServiceWorkerMock.mock.callCount(), 1);
    assert.strictEqual(rssFeedMock.mock.callCount(), 1);

    assert.deepStrictEqual(
      (generatePostPagesMock.mock.calls as any)[0].arguments[0],
      posts,
    );
    assert.deepStrictEqual(
      (generateIndexesMock.mock.calls as any)[0].arguments[0],
      posts,
    );
  });
});
