#!/usr/bin/env node
import htmlValidate from "./html/html-validate.js";
import appConfig from "../app-config.js";
import generatePostInfo from "../blog-generation/template/generate-post-info.js";
import spellCheck from "./spell-check/spell-check.js";
const { siteSourcePath } = appConfig;
const postInfo = await generatePostInfo();
await spellCheck(postInfo);
await htmlValidate(siteSourcePath, {
    "doctype-style": "off",
    "void-style": ["error", { style: "selfclosing" }],
    "no-implicit-button-type": "off",
    "unique-landmark": "off",
    "no-inline-style": "off",
});
//# sourceMappingURL=validate-dev.js.map