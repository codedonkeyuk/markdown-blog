import * as fs from "fs/promises";

const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
  }
};

export default deleteFile;
