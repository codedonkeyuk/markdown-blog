import * as fs from "fs/promises";
const createFile = async (path, content) => fs.writeFile(path, content, { encoding: "utf8" });
export default createFile;
//# sourceMappingURL=create-file.js.map