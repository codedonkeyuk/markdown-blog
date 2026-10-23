import * as fs from "fs/promises";

const createFile = async (path: string, content: string): Promise<void> =>
  fs.writeFile(path, content, { encoding: "utf8" });

export default createFile;
