import * as fs from "fs/promises";
const readDirectories = async (directoryPath) => {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });
    const directories = files
        .filter((file) => file.isDirectory())
        .map((dir) => dir.name);
    return directories;
};
export default readDirectories;
//# sourceMappingURL=read-directories.js.map