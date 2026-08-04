#!/usr/bin/env node

import htmlValidate from "./html/html-validate.ts";
import appConfig from "../app-config.ts";
import generatePostInfo from "../blog-generation/template/generate-post-info.ts";
import spellCheck from "./spell-check/spell-check.ts";

const { productionPath } = appConfig();

const postInfo = await generatePostInfo();
await spellCheck(postInfo);

await htmlValidate(productionPath, {
  "doctype-style": "off",
  "void-style": "off",
  "element-case": "off",
  "attr-case": "off",
  "attr-quotes": "off",
  "no-trailing-spaces": "off",
  whitespace: "off",
  "attribute-boolean-style": "off",

  "no-implicit-button-type": "off",
  "unique-landmark": "off",
  "no-inline-style": "off",
});
