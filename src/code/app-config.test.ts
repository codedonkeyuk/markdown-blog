import assert from "node:assert";
import { afterEach, before, describe, mock, test } from "node:test";
import fs from "node:fs";
import getConfig from "./app-config.ts";

describe("Configuration Tests", () => {
  let mockFileExists = true;
  let mockFileContent = "{}";

  // 1. Stub the standard native filesystem methods once for the suite
  before(() => {
    mock.method(fs, "existsSync", () => mockFileExists);
    mock.method(fs, "readFileSync", () => mockFileContent);
  });

  // 2. Reset the states back to default before every single test
  afterEach(() => {
    mockFileExists = true;
    mockFileContent = "{}";
  });

  test("Configuration object contains all required base properties", () => {
    const config = getConfig();
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

  test("Configuration object contains correctly derived path properties", () => {
    const config = getConfig();

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

  test("Configuration values can be custom mocked per test", () => {
    // 3. Simply update your variables right in the test body!
    mockFileContent = JSON.stringify({
      siteTitle: "Moo",
      postsPerPage: 99,
    });

    const config = getConfig();

    assert.strictEqual(config.siteTitle, "Moo");
    assert.strictEqual(config.postsPerPage, 99);
  });

  test("Falls back to defaults gracefully if file does not exist", () => {
    mockFileExists = false;

    const config = getConfig();

    // Should fall back to the ogBlogConfig internal value
    assert.strictEqual(config.siteTitle, "Markdown Blog");
  });
});
