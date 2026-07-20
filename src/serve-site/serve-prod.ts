#!/usr/bin/env node
import { pathToFileURL } from "url";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import appConfig from "../app-config.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { productionPath } = appConfig();
process.argv.push(productionPath);

const projectRoot = resolve(__dirname, "../../");
const appPath = resolve(projectRoot, "dist/serve-site/app.js");

await import(pathToFileURL(appPath).href);
