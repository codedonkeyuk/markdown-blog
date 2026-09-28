#!/usr/bin/env node
import htmlValidate from "./html/html-validate.js";
import appConfig from "../app-config.js";
import generatePostInfo from "../blog-generation/template/generate-post-info.js";
import spellCheck from "./spell-check/spell-check.js";
const { productionPath } = appConfig;
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
//# sourceMappingURL=validate-prod.js.map