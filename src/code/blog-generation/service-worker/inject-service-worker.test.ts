import { test, mock, afterEach, describe } from "node:test";
import assert from "node:assert";

const mockCreateFile = mock.fn(async (path: string, content: string) => {
  return Promise.resolve();
});

mock.module("../file-utils/create-file.ts", {
  namedExports: { default: mockCreateFile },
});
mock.module("../../app-config.ts", {
  namedExports: {
    productionPath: "/mock/prod/path",
  },
});

describe("Test app.ts", () => {
  afterEach(() => {
    mockCreateFile.mock.resetCalls();
  });

  test("Ensure app calls the correct mocked methods", async () => {
    const testee = await import(
      `./inject-service-worker.ts?update=${Date.now()}`
    );

    await testee.default();

    assert.strictEqual(mockCreateFile.mock.callCount(), 1);

    const firstCall = mockCreateFile.mock.calls[0];
    const targetPath = firstCall.arguments[0];
    const generatedContent = firstCall.arguments[1];

    assert.strictEqual(targetPath, "/mock/prod/path/sw.js");

    assert.match(generatedContent, /const CACHE_NAME = "site-assets-v\d+";/);

    assert.doesNotMatch(generatedContent, /site-assets-vNaN/);
    assert.doesNotMatch(generatedContent, /site-assets-vundefined/);

    assert.match(generatedContent, /"\/portfolio-cursed"/);
    assert.match(generatedContent, /"\/js\/app\.js"/);
    assert.match(generatedContent, /"\/offline\.html"/);

    assert.match(generatedContent, /caches\.match\("\/offline\.html"\)/);

    assert.match(
      generatedContent,
      /\.get\("accept"\)\.includes\("text\/html"\)/,
    );
  });
});
