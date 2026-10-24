import assert from "node:assert";
import { before, beforeEach, describe, mock, test } from "node:test";
import fs from "node:fs";

describe("Configuration Tests", () => {
  let mockFileExists = true;
  let mockFileContent = "{}";
  let counter = 0;

  const originalReadFileSync = fs.readFileSync;

  async function getConfigFresh() {
    const module = await import(`./app-config.ts?update=${counter++}`);

    return typeof module.default === "function"
      ? module.default()
      : module.default;
  }

  before(() => {
    mock.method(fs, "existsSync", (path: fs.PathLike) => {
      if (
        typeof path === "string" &&
        (path.endsWith(".json") || !path.includes("src/"))
      ) {
        return mockFileExists;
      }
      return true;
    });

    mock.method(fs, "readFileSync", function (path: any, options: any) {
      if (typeof path === "string" && path.endsWith(".json")) {
        return mockFileContent;
      }
      return originalReadFileSync.apply(fs, [path, options]);
    });
  });

  beforeEach(() => {
    mockFileExists = true;
    mockFileContent = "{}";
  });

  test("Configuration object contains all required base properties", async () => {
    const config = await getConfigFresh();
    assert.ok(config, "The configuration object is undefined.");

    const expectedKeys = [
      "siteSourcePath",
      "postSourcePath",
      "productionPath",
      "postsPerPage",
      "blogPath",
      "maxParallelProcesses",
      "maxCompresionProcesses",
      "siteTitle",
      "siteAddress",
      "rssDescription",
      "rssPostLimit",
    ] as const;

    for (const key of expectedKeys) {
      assert.ok(
        config[key] !== undefined,
        `Property ${key} is missing from configuration`,
      );
    }
  });

  test("Configuration object contains correctly derived path properties", async () => {
    const config = await getConfigFresh();

    assert.strictEqual(
      config.blogProductionPath,
      `${config.productionPath}/blog`,
    );
    assert.strictEqual(
      config.blogIndexPageTemplate,
      `${config.siteSourcePath}/blog/page1.html`,
    );
    assert.strictEqual(
      config.postPageTemplate,
      `${config.siteSourcePath}/blog/post/post.html`,
    );
  });

  test("Configuration values can be custom mocked per test", async () => {
    mockFileContent = JSON.stringify({
      siteTitle: "Moo",
      postsPerPage: 99,
    });

    const config = await getConfigFresh();

    assert.strictEqual(config.siteTitle, "Moo");
    assert.strictEqual(config.postsPerPage, 99);
  });

  test("Falls back to defaults gracefully if file does not exist", async () => {
    mockFileExists = false;

    const config = await getConfigFresh();

    assert.strictEqual(config.siteTitle, "Markdown Blog");
  });

  test("Throws an error if the configuration file has invalid JSON syntax", async () => {
    mockFileContent = "{ invalid json: ... }";

    await assert.rejects(
      async () => {
        await getConfigFresh();
      },
      (err: any) => {
        return err instanceof Error;
      },
      "Expected appConfig to throw when parsing invalid JSON syntax.",
    );
  });
});
