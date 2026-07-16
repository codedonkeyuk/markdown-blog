import htmlValidate from "./html-validate.ts";
import { siteSourcePath } from "../app-config.ts";

await htmlValidate(siteSourcePath, {
  "doctype-style": "off",
  "void-style": ["error", { style: "selfclosing" }],
  "no-implicit-button-type": "off",
  "unique-landmark": "off",
  "no-inline-style": "off",
});
