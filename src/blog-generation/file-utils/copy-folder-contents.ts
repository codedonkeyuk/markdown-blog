import { promises as fs } from "fs";
import * as path from "path";
import asyncPool from "../thread-management/async-pool.ts";
import appConfig from "../../app-config.ts";

interface CopyTask {
  srcPath: string;
  destPath: string;
  isDirectory: boolean;
}

async function gatherCopyTasks(
  src: string,
  dest: string,
  tasks: CopyTask[] = [],
): Promise<CopyTask[]> {
  const items = await fs.readdir(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = await fs.stat(srcPath);
    const isDirectory = stat.isDirectory();

    tasks.push({ srcPath, destPath, isDirectory });

    if (isDirectory) {
      await gatherCopyTasks(srcPath, destPath, tasks);
    }
  }

  return tasks;
}

async function copyFolderContents(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });

  const allTasks = await gatherCopyTasks(src, dest);

  const { maxParallelProcesses } = appConfig();

  await asyncPool(allTasks, maxParallelProcesses, async (task) => {
    if (task.isDirectory) {
      await fs.mkdir(task.destPath, { recursive: true });
    } else {
      await fs.mkdir(path.dirname(task.destPath), { recursive: true });
      await fs.copyFile(task.srcPath, task.destPath);
    }
  });
}

export default copyFolderContents;
