import { type RuleConfig } from "html-validate";
declare function htmlValidate(TARGET_DIR: string, rules: RuleConfig): Promise<void>;
export default htmlValidate;
