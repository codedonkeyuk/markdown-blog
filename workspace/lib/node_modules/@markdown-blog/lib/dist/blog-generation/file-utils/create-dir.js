import * as fs from "fs/promises";
const createDir = async (directoryPath) => fs.mkdir(directoryPath, { recursive: true });
export default createDir;
//# sourceMappingURL=create-dir.js.map