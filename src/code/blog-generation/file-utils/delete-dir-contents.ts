import { promises as fs } from "fs";
import * as path from "path";

async function deleteDirContents(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });

    const items = await fs.readdir(dirPath);

    for (const item of items) {
      if (item === ".git" || item.startsWith(".git")) {
        continue;
      }

      const fullPath = path.join(dirPath, item);
      await fs.rm(fullPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(`Failed to clean directory ${dirPath}:`, error);
    throw error;
  }
}

export default deleteDirContents;
