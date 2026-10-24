import * as fs from "fs/promises";

const createDir = async (directoryPath: string): Promise<string | undefined> =>
  fs.mkdir(directoryPath, { recursive: true });

export default createDir;
