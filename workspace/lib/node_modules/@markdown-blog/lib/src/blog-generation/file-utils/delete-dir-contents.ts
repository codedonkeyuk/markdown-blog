import { promises as fs } from "fs";
import * as path from "path";
import appConfig from "../../app-config.ts";
import asyncPool from "../thread-management/async-pool.ts";

async function deleteDirContents(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });

    const items = await fs.readdir(dirPath);

    const targets = items.filter((item) => {
      return item !== ".git" && !item.startsWith(".git");
    });

    const fullPaths = targets.map((item) => path.join(dirPath, item));

    const { maxCompresionProcesses } = appConfig;

    await asyncPool(fullPaths, maxCompresionProcesses, async (fullPath) => {
      await fs.rm(fullPath, { recursive: true, force: true });
    });
  } catch (error) {
    console.error(`Failed to clean directory ${dirPath}:`, error);
    throw error;
  }
}

export default deleteDirContents;
