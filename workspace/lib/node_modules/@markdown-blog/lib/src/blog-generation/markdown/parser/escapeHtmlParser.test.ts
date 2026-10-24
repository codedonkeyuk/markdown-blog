import assert from "node:assert";
import { test } from "node:test";

import { escapeHtmlParse, escapeHtmlRegex } from "./escapeHtmlParser.ts";

test("specialCharacterParse: correctly maps individual characters", () => {
  assert.strictEqual(escapeHtmlParse("&"), "&amp;");
  assert.strictEqual(escapeHtmlParse("<"), "&lt;");
  assert.strictEqual(escapeHtmlParse(">"), "&gt;");
  assert.strictEqual(escapeHtmlParse('"'), "&quot;");
  assert.strictEqual(escapeHtmlParse("'"), "&#39;");
  assert.strictEqual(escapeHtmlParse("/"), "&#47;");
});

test("specialCharacterRegex: matches all targeted characters", () => {
  const input = "Check & < > \" ' /";
  const matches = input.match(escapeHtmlRegex);

  assert.strictEqual(matches?.length, 6);

  assert.ok(matches?.includes("&"));
  assert.ok(matches?.includes("<"));
  assert.ok(matches?.includes(">"));
  assert.ok(matches?.includes('"'));
  assert.ok(matches?.includes("'"));
  assert.ok(matches?.includes("/"));
});

test("Integration: full string replacement", () => {
  const rawInput = '<script>alert("Hi")</script>';

  const escaped = rawInput.replace(escapeHtmlRegex, (match) => {
    return escapeHtmlParse(match);
  });

  const expected = "&lt;script&gt;alert(&quot;Hi&quot;)&lt;&#47;script&gt;";

  assert.strictEqual(escaped, expected);
});

test("Edge Case: handle empty or no special characters", () => {
  const input = "Hello World 123";
  const result = input.replace(escapeHtmlRegex, (match) => {
    return escapeHtmlParse(match);
  });

  assert.strictEqual(result, "Hello World 123");
  assert.strictEqual(result.length, input.length);
});
