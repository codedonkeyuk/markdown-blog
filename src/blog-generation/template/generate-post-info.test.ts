import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";

// 1. Establish your mock config state function globally
const mockConfigValues = {
  blogProductionPath: "./dist/blog",
  postSourcePath: "./src/blog/post",
  blogPath: "blog",
  maxParallelProcesses: 50,
};

mock.module(new URL("../../app-config.ts", import.meta.url).href, {
  exports: {
    default: () => mockConfigValues,
  },
});

describe("Test generate-post-info.ts", () => {
  const readDirectoriesMock = mock.fn() as Mock<
    (directoryPath: string) => Promise<string[]>
  >;

  const readFileMock = mock.fn() as Mock<
    (path: string, options?: any) => Promise<string>
  >;

  // Unique query tracking id index counter to cleanly bypass the ESM loader cache
  let cacheBustCounter = 0;

  beforeEach(async () => {
    readDirectoriesMock.mock.mockImplementation(async () => [
      "1672531200000_my-post",
    ]);

    readFileMock.mock.mockImplementation(async (path: string) => {
      return JSON.stringify({
        creationDate: "Sunday, 1 January 2023",
        creationTime: "12:00:00 am",
        creationTimestamp: 1672531200000,
        name: "my post",
        nameSlug: "my-post",
        pageDescription: "A new post",
        postThumbDescription: "A new post",
        pageImageDescription: "A new post",
        publish: true, // Fixed: Added to prevent .filter() from skipping this post
      });
    });

    // 2. Updated namedExports/defaultExport keys to modern exports blocks to fix loader deprecation bugs
    mock.module(
      new URL("../file-utils/read-directories.ts", import.meta.url).href,
      {
        exports: {
          default: readDirectoriesMock,
        },
      },
    );

    mock.module(new URL("../file-utils/read-file.ts", import.meta.url).href, {
      exports: {
        default: readFileMock,
      },
    });
  });

  afterEach(() => {
    readDirectoriesMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure post info is generated correctly", async () => {
    cacheBustCounter++;
    const testee = await import(
      `./generate-post-info.ts?update=${Date.now()}-${cacheBustCounter}`
    );
    const result = await testee.default();

    assert.strictEqual(readDirectoriesMock.mock.callCount(), 1);
    assert.strictEqual(
      readDirectoriesMock.mock.calls[0].arguments[0],
      "./src/blog/post",
    );

    assert.strictEqual(result.length, 1);

    const firstPost = result[0];
    assert.strictEqual(firstPost.nameSlug, "my-post");
    assert.strictEqual(firstPost.name, "my post");
    assert.strictEqual(firstPost.directory, "1672531200000_my-post");
    assert.strictEqual(firstPost.blogDirectory, "./dist/blog/2023-1-1-0-0-0");

    assert.strictEqual(firstPost.creationDate, "Sunday, 1 January 2023");
    assert.strictEqual(firstPost.creationTime, "12:00:00 am");
    assert.strictEqual(
      firstPost.blogPage,
      "./dist/blog/2023-1-1-0-0-0/my-post.html",
    );
    assert.strictEqual(firstPost.blogUrl, "/blog/2023-1-1-0-0-0/my-post");
  });

  test("Ensure empty directory list returns empty array", async () => {
    readDirectoriesMock.mock.mockImplementation(async () => []);

    cacheBustCounter++;
    const testee = await import(
      `./generate-post-info.ts?update=${Date.now()}-${cacheBustCounter}`
    );
    const result = await testee.default();

    assert.strictEqual(result.length, 0);
  });
});
