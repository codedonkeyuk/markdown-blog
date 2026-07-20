#!/usr/bin/env node

import htmlValidate from "./html-validate.ts";
import appConfig from "../app-config.ts";

const { siteSourcePath } = appConfig();

await htmlValidate(siteSourcePath, {
  "doctype-style": "off",
  "void-style": ["error", { style: "selfclosing" }],
  "no-implicit-button-type": "off",
  "unique-landmark": "off",
  "no-inline-style": "off",
});
