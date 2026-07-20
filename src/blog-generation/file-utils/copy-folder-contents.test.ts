import { test, describe, beforeEach, afterEach, mock } from "node:test";
import * as assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import * as fsSync from "node:fs";
import * as path from "path";

const SANDBOX_DIR = path.resolve("./copy-test-sandbox");
const SRC_DIR = path.join(SANDBOX_DIR, "src");
const DEST_DIR = path.join(SANDBOX_DIR, "dest");

describe("Copy Folder Contents Script Tests", () => {
  const mockConfig = {
    maxParallelProcesses: 4,
    siteSourcePath: "./src/site",
    postSourcePath: "./src/blog-content",
    productionPath: "./dist",
    postsPerPage: 20,
    blogPath: "blog",
    maxCompresionProcesses: 4,
    siteTitle: "Markdown Blog",
    siteAddress: "http://localhost:3001",
    rssDescription: "A web developers portfolio and blog.",
    rssPostLimit: 20,
    blogProductionPath: "./dist/blog",
    blogIndexPageTemplate: "./src/site/blog/page1.html",
    postPageTemplate: "./src/site/blog/post/post.html",
  };

  const configUrl = new URL("../../app-config.ts", import.meta.url).href;

  mock.module(configUrl, {
    exports: {
      default: () => mockConfig,
    },
  });

  beforeEach(() => {
    if (fsSync.existsSync(SANDBOX_DIR)) {
      fsSync.rmSync(SANDBOX_DIR, { recursive: true, force: true });
    }
    fsSync.mkdirSync(SRC_DIR, { recursive: true });
    fsSync.mkdirSync(path.join(SRC_DIR, "nested-folder"), { recursive: true });

    fsSync.writeFileSync(path.join(SRC_DIR, "root-file.txt"), "hello root");
    fsSync.writeFileSync(
      path.join(SRC_DIR, "nested-folder", "child-file.txt"),
      "hello child",
    );
  });

  afterEach(() => {
    if (fsSync.existsSync(SANDBOX_DIR)) {
      fsSync.rmSync(SANDBOX_DIR, { recursive: true, force: true });
    }
  });

  test("should successfully mirror files and directories using mocked maxParallelProcesses", async () => {
    const { default: copyFolderContents } = await import(
      `./copy-folder-contents.ts?update=${Date.now()}`
    );

    await copyFolderContents(SRC_DIR, DEST_DIR);

    const rootFileExists = fsSync.existsSync(
      path.join(DEST_DIR, "root-file.txt"),
    );
    const nestedDirExists = fsSync.existsSync(
      path.join(DEST_DIR, "nested-folder"),
    );
    const childFileExists = fsSync.existsSync(
      path.join(DEST_DIR, "nested-folder", "child-file.txt"),
    );

    assert.ok(rootFileExists, "The root level asset failed to copy.");
    assert.ok(nestedDirExists, "The nested folder tree was not created.");
    assert.ok(
      childFileExists,
      "The child asset within the sub-directory failed to copy.",
    );

    const rootContents = await fs.readFile(
      path.join(DEST_DIR, "root-file.txt"),
      "utf8",
    );
    assert.strictEqual(rootContents, "hello root");
  });
});
