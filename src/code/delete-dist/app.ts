import deleteDirContents from "../blog-generation/file-utils/delete-dir-contents.ts";
import { productionPath } from "../app-config.ts";

console.log("Deleteing dist directory");
await deleteDirContents(productionPath);
