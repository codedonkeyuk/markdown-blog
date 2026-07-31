import { test, describe, beforeEach, afterEach, mock } from "node:test";
import * as assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";

const TEST_DIST = path.resolve("./dist-test-sandbox-two");

describe("Asset Hashing Script Tests", () => {
  const mockConfig = {
    productionPath: TEST_DIST,
    siteSourcePath: "./src/site",
    postSourcePath: "./src/blog-content",
    postsPerPage: 20,
    blogPath: "blog",
    maxParallelProcesses: 24,
    maxCompresionProcesses: 4,
    siteTitle: "Markdown Blog",
    siteAddress: "http://localhost:3001",
    rssDescription: "A web developers portfolio and blog.",
    rssPostLimit: 20,
    blogProductionPath: `${TEST_DIST}/blog`,
    blogIndexPageTemplate: "./src/site/blog/page1.html",
    postPageTemplate: "./src/site/blog/post/post.html",
  };

  mock.module("../../app-config.ts", {
    exports: {
      default: () => mockConfig,
    },
  });

  beforeEach(() => {
    mockConfig.productionPath = TEST_DIST;
    mockConfig.blogProductionPath = `${TEST_DIST}/blog`;

    if (fs.existsSync(TEST_DIST)) {
      fs.rmSync(TEST_DIST, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIST, { recursive: true });
    fs.mkdirSync(path.join(TEST_DIST, "css"), { recursive: true });
    fs.mkdirSync(path.join(TEST_DIST, "js"), { recursive: true });
    fs.mkdirSync(path.join(TEST_DIST, "img"), { recursive: true });

    fs.writeFileSync(
      path.join(TEST_DIST, "css", "styles.css"),
      "body { background: url('/img/photo.png'); }",
    );

    fs.writeFileSync(
      path.join(TEST_DIST, "js", "main.js"),
      "console.log('init');",
    );

    fs.writeFileSync(
      path.join(TEST_DIST, "img", "photo.png"),
      "fake-png-binary-payload",
    );

    fs.writeFileSync(
      path.join(TEST_DIST, "index.html"),
      `<html>
  <head>
    <link rel="stylesheet" href="/css/styles.css">
    <script src="http://localhost:3001/js/main.js"></script>
    <img src="https://thirdparty.com" />
  </head>
</html>`,
    );
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIST)) {
      fs.rmSync(TEST_DIST, { recursive: true, force: true });
    }
  });

  test("should physically hash assets and cleanly swap internal file strings", async () => {
    const { default: hashAssets } = await import(
      `./hash-assets.ts?update=${Date.now()}`
    );

    mock.method(console, "log", () => {});

    await hashAssets();

    assert.ok(
      fs.existsSync(path.join(TEST_DIST, "index.html")),
      "index.html filename must never be altered",
    );
    assert.strictEqual(
      fs.existsSync(path.join(TEST_DIST, "css/styles.css")),
      false,
      "Original unhashed styles.css must be deleted",
    );
    assert.strictEqual(
      fs.existsSync(path.join(TEST_DIST, "js/main.js")),
      false,
      "Original unhashed main.js must be deleted",
    );
    assert.strictEqual(
      fs.existsSync(path.join(TEST_DIST, "img/photo.png")),
      false,
      "Original unhashed photo.png must be deleted",
    );

    const cssFiles = fs.readdirSync(path.join(TEST_DIST, "css"));
    const jsFiles = fs.readdirSync(path.join(TEST_DIST, "js"));
    const imgFiles = fs.readdirSync(path.join(TEST_DIST, "img"));

    assert.strictEqual(cssFiles.length, 1);
    assert.strictEqual(jsFiles.length, 1);
    assert.strictEqual(imgFiles.length, 1);

    const computedCssName = cssFiles[0];
    const computedJsName = jsFiles[0];
    const computedImgName = imgFiles[0];

    assert.match(computedCssName, /^styles\.[a-f0-9]{8}\.css$/);
    assert.match(computedJsName, /^main\.[a-f0-9]{8}\.js$/);
    assert.match(computedImgName, /^photo\.[a-f0-9]{8}\.png$/);

    const updatedHtml = fs.readFileSync(
      path.join(TEST_DIST, "index.html"),
      "utf8",
    );
    const updatedCss = fs.readFileSync(
      path.join(TEST_DIST, "css", computedCssName),
      "utf8",
    );

    assert.ok(
      updatedHtml.includes(`href="/css/${computedCssName}"`),
      "HTML root-relative CSS link string update failed",
    );
    assert.ok(
      updatedHtml.includes(`src="http://localhost:3001/js/${computedJsName}"`),
      "HTML dynamic domain JS link string update failed",
    );
    assert.ok(
      updatedHtml.includes('src="https://thirdparty.com"'),
      "Third-party domains must remain untouched",
    );
    assert.ok(
      updatedCss.includes(`url('/img/${computedImgName}')`),
      "Cascaded reference conversion inside the CSS file body failed",
    );
  });
});
