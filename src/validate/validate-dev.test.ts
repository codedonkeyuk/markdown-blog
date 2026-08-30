import { test, mock } from "node:test";
import assert from "node:assert";

const mockConfigValues = {
  siteSourcePath: "./src/site",
};

mock.module(new URL("../app-config.ts", import.meta.url).href, {
  exports: {
    default: mockConfigValues,
  },
});

const { siteSourcePath } = mockConfigValues;

const htmlValidateSpy = mock.fn();
const spellCheckSpy = mock.fn();
const generatePostInfoSpy = mock.fn();

mock.module(new URL("./html/html-validate.ts", import.meta.url).href, {
  exports: {
    default: htmlValidateSpy,
  },
});

mock.module(new URL("./spell-check/spell-check.ts", import.meta.url).href, {
  exports: {
    default: spellCheckSpy,
  },
});

mock.module(
  new URL("../blog-generation/template/generate-post-info.ts", import.meta.url)
    .href,
  {
    exports: {
      default: generatePostInfoSpy,
    },
  },
);

test("Test validate-dev", async () => {
  await import(`./validate-dev.ts?update=${Date.now()}`);
  assert.strictEqual(generatePostInfoSpy.mock.callCount(), 1);
  assert.strictEqual(spellCheckSpy.mock.callCount(), 1);
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
