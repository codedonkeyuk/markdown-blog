import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";
import { type PostInfo } from "../types.ts";

describe("Test generate-indexes.ts", async () => {
  const readFileMock = mock.fn() as Mock<(path: string) => Promise<string>>;
  const createFileMock = mock.fn() as Mock<
    (path: string, content: string) => Promise<void>
  >;
  const createIndexPageMock = mock.fn() as Mock<
    (
      template: string,
      posts: PostInfo[],
      pageNo: number,
      maxPage: number,
    ) => string
  >;

  beforeEach(async () => {
    readFileMock.mock.mockImplementation(async () => "<html>Template</html>");
    createFileMock.mock.mockImplementation(async () => {});

    createIndexPageMock.mock.mockImplementation(() => "<html>Page</html>");

    mock.module("../file-utils/read-file.ts", {
      defaultExport: readFileMock,
    });
    mock.module("../file-utils/create-file.ts", {
      defaultExport: createFileMock,
    });
    mock.module("./create-index-page.ts", {
      defaultExport: createIndexPageMock,
    });
    mock.module("../../app-config.ts", {
      namedExports: {
        blogProductionPath: "./dist/blog",
        blogIndexPageTemplate: "./src/blog/page1.html",
        postsPerPage: 2,
        maxParallelProcesses: 50,
      },
    });
  });

  afterEach(() => {
    readFileMock.mock.resetCalls();
    createFileMock.mock.resetCalls();
    createIndexPageMock.mock.resetCalls();

    mock.restoreAll();
  });

  test("Ensure indexes are generated for single page", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "",
        creationDate: new Date("2023-01-01").toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        creationTime: new Date("2023-01-01").toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        creationTimestamp: new Date("2023-01-01").getTime(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
      {
        name: "Post 2",
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
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-indexes.ts");
    await testee.default(posts);

    assert.strictEqual(readFileMock.mock.callCount(), 1);
    assert.strictEqual(
      readFileMock.mock.calls[0].arguments[0],
      "./src/blog/page1.html",
    );

    assert.strictEqual(createIndexPageMock.mock.callCount(), 1);
    assert.strictEqual(
      createIndexPageMock.mock.calls[0].arguments[1].length,
      2,
    );
    assert.strictEqual(createIndexPageMock.mock.calls[0].arguments[2], 0);
    assert.strictEqual(createIndexPageMock.mock.calls[0].arguments[3], 1);

    assert.strictEqual(createFileMock.mock.callCount(), 1);
    assert.strictEqual(
      createFileMock.mock.calls[0].arguments[0],
      "./dist/blog/page1.html",
    );
  });

  test("Ensure indexes are generated for multiple pages", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "",
        creationDate: new Date("2023-01-01").toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        creationTime: new Date("2023-01-01").toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        creationTimestamp: new Date("2023-01-01").getTime(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
      {
        name: "Post 2",
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
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
      {
        name: "Post 3",
        nameSlug: "",
        creationDate: new Date("2023-01-03").toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        creationTime: new Date("2023-01-03").toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        creationTimestamp: new Date("2023-01-03").getTime(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-indexes.ts");
    await testee.default(posts);

    assert.strictEqual(createIndexPageMock.mock.callCount(), 2);
    assert.strictEqual(createFileMock.mock.callCount(), 2);
    assert.strictEqual(
      createFileMock.mock.calls[0].arguments[0],
      "./dist/blog/page1.html",
    );
    assert.strictEqual(
      createFileMock.mock.calls[1].arguments[0],
      "./dist/blog/page2.html",
    );
  });

  test("Ensure posts are sorted by creation date descending", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "",
        creationDate: new Date("2023-01-01").toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        creationTime: new Date("2023-01-01").toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        creationTimestamp: new Date("2023-01-01").getTime(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
      {
        name: "Post 3",
        nameSlug: "",
        creationDate: new Date("2023-01-03").toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        creationTime: new Date("2023-01-03").toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        creationTimestamp: new Date("2023-01-03").getTime(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
      {
        name: "Post 2",
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
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-indexes.ts");
    await testee.default(posts);

    const calledPosts = createIndexPageMock.mock.calls[0].arguments[1];
    assert.strictEqual(calledPosts[0].name, "Post 3");
    assert.strictEqual(calledPosts[1].name, "Post 2");

    const calledPostsTwo = createIndexPageMock.mock.calls[1].arguments[1];
    assert.strictEqual(calledPostsTwo[0].name, "Post 1");
  });
});
