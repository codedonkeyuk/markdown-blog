#!/usr/bin/env node

import htmlValidate from "./html-validate.ts";
import appConfig from "../app-config.ts";

const { productionPath } = appConfig();

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
