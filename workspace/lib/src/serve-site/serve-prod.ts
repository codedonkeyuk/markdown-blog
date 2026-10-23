#!/usr/bin/env node
import { pathToFileURL } from "url";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import appConfig from "../app-config.ts";

export default async function App() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const projectRoot = resolve(__dirname, "../../");
  const appPath = resolve(projectRoot, "dist/serve-site/app.js");

  const { productionPath } = appConfig;

  const absoluteProdPath = resolve(process.cwd(), productionPath);

  process.argv = [process.argv[0], process.argv[1], absoluteProdPath];

  await import(pathToFileURL(appPath).href);
}
