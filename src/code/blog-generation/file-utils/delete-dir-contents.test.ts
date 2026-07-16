import test from "node:test";
import assert from "node:assert";
import { promises as fs } from "fs";
import * as path from "path";
import * as os from "os";
import deleteDirContents from "./delete-dir-contents.ts";

test("deleteDirContents clears assets and subfolders, but preserves git files", async () => {
  const tempRootDir = await fs.mkdtemp(path.join(os.tmpdir(), "clean-test-"));
  const blogSubDir = path.join(tempRootDir, "blog");
  const gitSubDir = path.join(tempRootDir, ".git");

  await fs.mkdir(blogSubDir);
  await fs.mkdir(gitSubDir);

  const filesToCreate = [
    path.join(tempRootDir, "index.html"),
    path.join(tempRootDir, "index.html.gz"),
    path.join(tempRootDir, "index.html.br"),
    path.join(tempRootDir, ".gitignore"),
    path.join(blogSubDir, "post-one.html"),
    path.join(blogSubDir, "post-one.html.br"),
    path.join(gitSubDir, "HEAD"),
  ];

  for (const filePath of filesToCreate) {
    await fs.writeFile(filePath, "dummy text data");
  }

  const preCheck = await fs.readdir(tempRootDir);
  assert.ok(preCheck.length > 0, "Setup failed: Mock files were not created.");

  await deleteDirContents(tempRootDir);

  const postCheck = await fs.readdir(tempRootDir);

  assert.strictEqual(
    postCheck.length,
    2,
    `Directory should only contain git files, but contains ${postCheck.length} items: ${postCheck.join(", ")}`,
  );

  assert.ok(
    postCheck.includes(".git"),
    "The hidden .git folder was accidentally deleted.",
  );
  assert.ok(
    postCheck.includes(".gitignore"),
    "The .gitignore file was accidentally deleted.",
  );

  const gitContents = await fs.readdir(gitSubDir);
  assert.ok(
    gitContents.includes("HEAD"),
    "Files inside the .git directory were lost.",
  );

  const rootStat = await fs.stat(tempRootDir);
  assert.ok(
    rootStat.isDirectory(),
    "The root directory itself was mistakenly removed entirely.",
  );

  await fs.rm(tempRootDir, { recursive: true, force: true });
});

test("deleteDirContents handles non-existent directories gracefully without throwing errors", async () => {
  const fakePath = path.join(os.tmpdir(), `non-existent-folder-${Date.now()}`);

  await assert.doesNotReject(async () => {
    await deleteDirContents(fakePath);
  }, "Should not throw an error if the targeted directory does not exist yet.");

  const stat = await fs.stat(fakePath);
  assert.ok(
    stat.isDirectory(),
    "Should have initialized the missing folder paths.",
  );

  await fs.rm(fakePath, { recursive: true, force: true });
});
