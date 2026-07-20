import deleteDirContents from "../blog-generation/file-utils/delete-dir-contents.ts";
import appConfig from "../app-config.ts";

console.log("Deleteing dist directory");
const { productionPath } = appConfig();
await deleteDirContents(productionPath);
