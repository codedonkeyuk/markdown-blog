#!/usr/bin/env node

import htmlValidate from "./html/html-validate.ts";
import appConfig from "../app-config.ts";
import generatePostInfo from "../blog-generation/template/generate-post-info.ts";
import spellCheck from "./spell-check/spell-check.ts";

const { siteSourcePath } = appConfig();

const postInfo = await generatePostInfo();
await spellCheck(postInfo);

await htmlValidate(siteSourcePath, {
  "doctype-style": "off",
  "void-style": ["error", { style: "selfclosing" }],
  "no-implicit-button-type": "off",
  "unique-landmark": "off",
  "no-inline-style": "off",
});
