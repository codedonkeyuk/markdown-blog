import * as fs from "fs/promises";
const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    }
    catch (error) {
        console.error(`Error deleting file: ${error}`);
    }
};
export default deleteFile;
//# sourceMappingURL=delete-file.js.map