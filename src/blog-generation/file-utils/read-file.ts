import * as fs from "fs/promises";

const readFile = async (filePath: string): Promise<string> =>
  fs.readFile(filePath, "utf-8");

export default readFile;
