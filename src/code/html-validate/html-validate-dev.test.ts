import { test, mock } from "node:test";
import assert from "node:assert";
import { siteSourcePath } from "../app-config.ts";

const htmlValidateSpy = mock.fn();

mock.module("./html-validate.ts", {
  namedExports: {
    default: htmlValidateSpy,
  },
});

test("Test html-validate-dev", async () => {
  await import("./html-validate-dev.ts");

  assert.strictEqual(htmlValidateSpy.mock.callCount(), 1);

  const firstCall = htmlValidateSpy.mock.calls[0];
  const [passedPath, passedRules] = firstCall.arguments;

  assert.strictEqual(
    passedPath,
    siteSourcePath,
    "Should match your app config sourcePath",
  );
  assert.deepStrictEqual(
    passedRules,
    {
      "doctype-style": "off",
      "void-style": ["error", { style: "selfclosing" }],
      "no-implicit-button-type": "off",
      "unique-landmark": "off",
      "no-inline-style": "off",
    },
    "Should match your expected dev rules tuple configuration",
  );
});
