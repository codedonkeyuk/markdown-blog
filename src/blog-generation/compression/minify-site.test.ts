import { test, describe, beforeEach, afterEach, mock } from "node:test";
import * as assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";

const TEST_DIST = path.resolve("./dist-test-sandbox");

describe("Minifier Script Tests", () => {
  // 1. Your configurable configuration object
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

  // 2. CORRECTION: Change exports to provide the function as the 'default' key
  mock.module("../../app-config.ts", {
    exports: {
      default: () => mockConfig,
    },
  });

  beforeEach(() => {
    // 3. Keep your test sandbox state synced up
    mockConfig.productionPath = TEST_DIST;
    mockConfig.blogProductionPath = `${TEST_DIST}/blog`;

    if (fs.existsSync(TEST_DIST)) {
      fs.rmSync(TEST_DIST, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIST, { recursive: true });
    fs.mkdirSync(path.join(TEST_DIST, "css"), { recursive: true });

    fs.writeFileSync(
      path.join(TEST_DIST, "index.html"),
      "<!-- This is a comment -->\n<html>\n  <body>\n    <h1>  Hello   World  </h1>\n  </body>\n</html>",
    );

    fs.writeFileSync(
      path.join(TEST_DIST, "css", "main.css"),
      '@import "reset.css";\n\nbody {\n  background-color: white;\n  margin: 0px;\n}',
    );

    fs.writeFileSync(
      path.join(TEST_DIST, "app.js"),
      "function calculateProductionTotal() {\n  const highlyDescriptiveVariableName = 100;\n  return highlyDescriptiveVariableName;\n}",
    );
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIST)) {
      fs.rmSync(TEST_DIST, { recursive: true, force: true });
    }
  });

  test("should successfully minify files in mocked productionPath directory", async () => {
    // 4. Clean up: Remove the old `mock.module` block from inside the test body.
    // The query string cache buster (?update=) will cleanly pick up the module mock above.
    const { default: minifySite } = await import(
      `./minify-site.ts?update=${Date.now()}`
    );

    mock.method(console, "log", () => {});

    await minifySite();

    const optimizedHtml = fs.readFileSync(
      path.join(TEST_DIST, "index.html"),
      "utf8",
    );
    assert.ok(
      !optimizedHtml.includes("<!-- This is a comment -->"),
      "HTML comment should be stripped",
    );
    assert.ok(
      !optimizedHtml.includes("\n"),
      "HTML should be collapsed into a single line",
    );

    const optimizedCss = fs.readFileSync(
      path.join(TEST_DIST, "css", "main.css"),
      "utf8",
    );

    assert.ok(
      optimizedCss.includes('@import "reset.css";'),
      "LightningCSS preserves valid standard imports rather than forcing url() wrappers",
    );
    assert.ok(
      optimizedCss.includes("body{background-color:#fff;margin:0}"),
      "LightningCSS leaves background-color intact and minimizes the white keyword to #fff",
    );
    assert.ok(
      !optimizedCss.includes("\n"),
      "CSS whitespaces should be completely removed",
    );

    const optimizedJs = fs.readFileSync(path.join(TEST_DIST, "app.js"), "utf8");
    assert.ok(
      !optimizedJs.includes("highlyDescriptiveVariableName"),
      "JS variable names should be completely mangled by terser",
    );
  });
});
