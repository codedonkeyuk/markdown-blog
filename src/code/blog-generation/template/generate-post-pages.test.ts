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

describe("Test generate-post-pages.ts", async () => {
  const readFileMock = mock.fn() as Mock<(path: string) => Promise<string>>;
  const createDirMock = mock.fn() as Mock<(path: string) => Promise<void>>;
  const createFileMock = mock.fn() as Mock<(path: string) => Promise<void>>;
  const deleteFileMock = mock.fn() as Mock<(path: string) => Promise<void>>;
  const copyFolderContentsMock = mock.fn() as Mock<
    (from: string, too: string) => Promise<void>
  >;
  const createPostPageMock = mock.fn() as Mock<
    (path: string) => Promise<string>
  >;
  const convertSvgToPngMock = mock.fn() as Mock<
    (
      input: string,
      output: string,
    ) => Promise<{ success: boolean; path: string }>
  >;

  let readFileContext: any;
  let createDirContext: any;
  let createFileContext: any;
  let deleteFileContext: any;
  let copyFolderContentsContext: any;
  let createPostPageContext: any;
  let appConfigContext: any;
  let convertSvgToPngContext: any;

  beforeEach(async () => {
    readFileMock.mock.mockImplementation(async (path: string) => {
      if (path.endsWith("page.html")) return "<html>Template</html>";
      if (path.endsWith("content.md")) return "# Post Content";
      return "";
    });

    createDirMock.mock.mockImplementation(async () => {});
    createFileMock.mock.mockImplementation(async () => {});
    deleteFileMock.mock.mockImplementation(async () => {});
    copyFolderContentsMock.mock.mockImplementation(() => Promise.resolve());
    createPostPageMock.mock.mockImplementation(async () => "<html>Page</html>");
    convertSvgToPngMock.mock.mockImplementation(
      async (input: string, output: string) => {
        return { success: true, path: output };
      },
    );

    readFileContext = mock.module("../file-utils/read-file.ts", {
      defaultExport: readFileMock,
    });
    createDirContext = mock.module("../file-utils/create-dir.ts", {
      defaultExport: createDirMock,
    });
    createFileContext = mock.module("../file-utils/create-file.ts", {
      defaultExport: createFileMock,
    });
    deleteFileContext = mock.module("../file-utils/delete-file.ts", {
      defaultExport: deleteFileMock,
    });
    copyFolderContentsContext = mock.module(
      "../file-utils/copy-folder-contents.ts",
      {
        defaultExport: copyFolderContentsMock,
      },
    );
    createPostPageContext = mock.module("./create-post-page.ts", {
      defaultExport: createPostPageMock,
    });
    convertSvgToPngContext = mock.module("../image/convert-svg-to-png.ts", {
      defaultExport: convertSvgToPngMock,
    });
    appConfigContext = mock.module("../../app-config.ts", {
      namedExports: {
        postSourcePath: "./src/blog/post",
        blogProductionPath: "./dist/blog",
        postPageTemplate: "./src/blog/post/post.html",
        maxParallelProcesses: 50,
      },
    });
  });

  afterEach(() => {
    if (readFileContext) readFileContext.restore();
    if (createDirContext) createDirContext.restore();
    if (createFileContext) createFileContext.restore();
    if (deleteFileContext) deleteFileContext.restore();
    if (copyFolderContentsContext) copyFolderContentsContext.restore();
    if (createPostPageContext) createPostPageContext.restore();
    if (appConfigContext) appConfigContext.restore();
    if (convertSvgToPngContext) convertSvgToPngContext.restore();

    readFileMock.mock.resetCalls();
    createDirMock.mock.resetCalls();
    createFileMock.mock.resetCalls();
    deleteFileMock.mock.resetCalls();
    copyFolderContentsMock.mock.resetCalls();
    createPostPageMock.mock.resetCalls();
    convertSvgToPngMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure post template is read once", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "post1",
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
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
      {
        name: "Post 2",
        nameSlug: "post2",
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
        blogDirectory: "./dist/blog/2023-1-2-0-0-0",
        dateDirectory: "2023-1-2-0-0-0",
        directory: "1672617600000_post2",
        blogPage: "./dist/blog/2023-1-2-0-0-0/post2.html",
        blogUrl: "/posts/2023-1-2-0-0-0/post2.html",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(readFileMock.mock.callCount(), 3); // template + 2 content.md files
    assert.strictEqual(
      readFileMock.mock.calls[0].arguments[0],
      "./src/blog/post/post.html",
    );
  });

  test("Ensure directories are created for each post", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "post1",
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
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(createDirMock.mock.callCount(), 1);
    assert.strictEqual(
      createDirMock.mock.calls[0].arguments[0],
      "./dist/blog/2023-1-1-0-0-0",
    );
  });

  test("Ensure post pages are created for each post", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "post1",
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
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(createFileMock.mock.callCount(), 1);
    assert.strictEqual(
      createFileMock.mock.calls[0].arguments[0],
      "./dist/blog/2023-1-1-0-0-0/post1.html",
    );
  });

  test("Ensure folder contents are copied and content.md is deleted", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        nameSlug: "post1",
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
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
        pageDescription: "",
        postThumbDescription: "",
        pageImageDescription: "",
        author: "",
        publish: true,
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(copyFolderContentsMock.mock.callCount(), 1);
    assert.strictEqual(
      copyFolderContentsMock.mock.calls[0].arguments[0],
      "./src/blog/post/1672531200000_post1",
    );
    assert.strictEqual(
      copyFolderContentsMock.mock.calls[0].arguments[1],
      "./dist/blog/2023-1-1-0-0-0",
    );

    assert.strictEqual(deleteFileMock.mock.callCount(), 1);
    assert.strictEqual(
      deleteFileMock.mock.calls[0].arguments[0],
      "./dist/blog/2023-1-1-0-0-0/content.md",
    );
  });
});
