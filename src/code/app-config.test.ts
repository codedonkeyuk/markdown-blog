import { describe, test } from "node:test";
import assert from "node:assert";
import * as testee from "./app-config.ts";

describe("Test app-config.ts", () => {
  test("Count exported attributes, confirm each returns correct paramater", () => {
    assert.strictEqual(Object.keys(testee).length, 14);

    assert.strictEqual(testee.siteSourcePath, "./src/site");
    assert.strictEqual(testee.productionPath, "./dist");
    assert.strictEqual(testee.blogProductionPath, "./dist/blog");
    assert.strictEqual(testee.postSourcePath, "./src/blog-content");
    assert.strictEqual(testee.siteTitle, "Markdown Blog");
    assert.strictEqual(testee.siteAddress, "http://localhost:3001");
    assert.strictEqual(
      testee.rssDescription,
      "A web developers portfolio and blog.",
    );
    assert.strictEqual(
      testee.rssDescription,
      "A web developers portfolio and blog.",
    );
    assert.strictEqual(
      testee.blogIndexPageTemplate,
      "./src/site/blog/page1.html",
    );
    assert.strictEqual(
      testee.postPageTemplate,
      "./src/site/blog/post/post.html",
    );
    assert.strictEqual(testee.postsPerPage, 20);
    assert.strictEqual(testee.rssPostLimit, 20);
    assert.strictEqual(testee.blogPath, "blog");
    assert.strictEqual(testee.maxParallelProcesses, 24);
    assert.strictEqual(testee.maxCompresionProcesses, 4);
  });
});
