import { describe, test } from "node:test";
import assert from "node:assert/strict";
import templateParameterRegex from "./template-parameter-regex.ts";

describe("templateParameterRegex Utility", () => {
  test("should successfully remove a single-line injection block", () => {
    const template =
      "<div><!--INJECT-TEST-START-->Old Content<!--INJECT-TEST-END--></div>";
    const regex = templateParameterRegex("TEST");

    const result = template.replace(regex, "New Content");

    assert.equal(result, "<div>New Content</div>");
  });

  test("should successfully match and remove multi-line fallback content", () => {
    const template = `
      <main>
        <!--INJECT-CONTENT-START-->
        <p>Line 1</p>
        <p>Line 2</p>
        <!--INJECT-CONTENT-END-->
      </main>
    `;
    const regex = templateParameterRegex("CONTENT");

    const result = template.replace(regex, "<p>Fresh Content</p>");

    const expected = `
      <main>
        <p>Fresh Content</p>
      </main>
    `;
    assert.equal(result, expected);
  });

  test("should support global matching to replace multiple instances of the same token", () => {
    const template =
      "<!--INJECT-COPY-START-->One<!--INJECT-COPY-END--> and <!--INJECT-COPY-START-->Two<!--INJECT-COPY-END-->";
    const regex = templateParameterRegex("COPY");

    const result = template.replace(regex, "Same");

    assert.equal(result, "Same and Same");
  });
});
