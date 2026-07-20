import { test, mock } from "node:test";
import assert from "node:assert";

// 1. Establish your mock config state block
const mockConfigValues = {
  siteSourcePath: "./src/site",
};

// 2. Intercept app-config.ts globally for this runner pass using fully-qualified absolute URLs
mock.module(new URL("../app-config.ts", import.meta.url).href, {
  exports: {
    default: () => mockConfigValues,
  },
});

// Extract the local siteSourcePath variable to preserve your existing test assertions
const { siteSourcePath } = mockConfigValues;

const htmlValidateSpy = mock.fn();

// Fixed deprecation structure: moved namedExports to exports.default
mock.module(new URL("./html-validate.ts", import.meta.url).href, {
  exports: {
    default: htmlValidateSpy,
  },
});

test("Test html-validate-dev", async () => {
  await import(`./html-validate-dev.ts?update=${Date.now()}`);

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
