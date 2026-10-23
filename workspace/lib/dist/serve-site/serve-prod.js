#!/usr/bin/env node
var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { pathToFileURL } from "url";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import appConfig from "../app-config.js";
export default async function App() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const projectRoot = resolve(__dirname, "../../");
    const appPath = resolve(projectRoot, "dist/serve-site/app.js");
    const { productionPath } = appConfig;
    const absoluteProdPath = resolve(process.cwd(), productionPath);
    process.argv = [process.argv[0], process.argv[1], absoluteProdPath];
    await import(__rewriteRelativeImportExtension(pathToFileURL(appPath).href));
}
//# sourceMappingURL=serve-prod.js.map