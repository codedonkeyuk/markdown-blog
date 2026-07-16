import { test, describe, beforeEach, afterEach, mock } from "node:test";
import * as assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";

const TEST_DIST = path.resolve("./dist-test-sandbox");

describe("Minifier Script Tests", () => {
  beforeEach(() => {
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
      "// JavaScript Comment\nfunction calculateProductionTotal() {\n  const highlyDescriptiveVariableName = 100;\n  return highlyDescriptiveVariableName;\n}",
    );
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIST)) {
      fs.rmSync(TEST_DIST, { recursive: true, force: true });
    }
  });

  test("should successfully minify files in mocked productionPath directory", async () => {
    mock.module("../../app-config.ts", {
      namedExports: {
        productionPath: TEST_DIST,
      },
    });

    const { default: minifySite } = await import("./minify-site.ts");

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
    console.log("MOO");
    console.log(optimizedCss);
    assert.ok(
      optimizedCss.includes("@import url(reset.css);"),
      "CSS @import should be normalized to url() format",
    );
    assert.ok(
      optimizedCss.includes("body{background-color:#fff;margin:0}"),
      "CSS properties should be completely compressed",
    );
    assert.ok(
      !optimizedCss.includes("\n"),
      "CSS whitespaces should be removed",
    );

    const optimizedJs = fs.readFileSync(path.join(TEST_DIST, "app.js"), "utf8");
    assert.ok(
      !optimizedJs.includes("// JavaScript Comment"),
      "JS comments should be stripped",
    );
    assert.ok(
      !optimizedJs.includes("highlyDescriptiveVariableName"),
      "JS variable names should be mangled",
    );
  });
});
