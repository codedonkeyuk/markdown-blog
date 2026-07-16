import * as fs from "fs/promises";

const readDirectories = async (directoryPath: string): Promise<string[]> => {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  const directories = files
    .filter((file) => file.isDirectory())
    .map((dir) => dir.name);

  return directories;
};

export default readDirectories;
