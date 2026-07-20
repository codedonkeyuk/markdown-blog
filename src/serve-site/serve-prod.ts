#!/usr/bin/env node
import { pathToFileURL } from "url";
import { resolve } from "path";
import appConfig from "../app-config.ts";

const { productionPath } = appConfig();

process.argv.push(productionPath);

const appPath = resolve(process.cwd(), "dist/serve-site/app.js");

await import(pathToFileURL(appPath).href);
