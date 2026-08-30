import { test, mock, afterEach, describe } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";

const mockConfig = {
  productionPath: "/mock/prod/path",
};

mock.module("../../app-config.ts", {
  exports: {
    default: mockConfig,
  },
});

const mockCreateFile = mock.fn(async (path: string, content: string) => {
  return Promise.resolve();
});

mock.module(new URL("../file-utils/create-file.ts", import.meta.url).href, {
  exports: {
    default: mockCreateFile,
  },
});

mock.method(fs, "readdirSync", (dirPath: string) => {
  const resolved = path.resolve(dirPath);
  if (resolved === path.resolve("/mock/prod/path")) {
    return ["index.html", "js", "portfolio-cursed.html", "offline.html"];
  }
  if (resolved === path.resolve("/mock/prod/path/js")) {
    return ["app.js"];
  }
  return [];
});

mock.method(fs, "statSync", (filePath: string) => {
  const resolved = path.resolve(filePath);
  return {
    isDirectory: () =>
      resolved === path.resolve("/mock/prod/path") ||
      resolved === path.resolve("/mock/prod/path/js"),
  };
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

    assert.match(generatedContent, /"\/js\/app\.js"/);
    assert.match(generatedContent, /"\/portfolio-cursed"/);

    assert.match(generatedContent, /caches\.match\("\/offline"\)/);

    // Fixed: Updated to match the optional chaining (?.) in the new sw logic
    assert.match(
      generatedContent,
      /\.get\("accept"\)\?\.includes\("text\/html"\)/,
    );
  });
});
