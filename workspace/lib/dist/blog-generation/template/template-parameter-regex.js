const templateParameterRegex = (token) => new RegExp(`<!--INJECT-${token}-START-->[\\s\\S]*?<!--INJECT-${token}-END-->`, "g");
export default templateParameterRegex;
//# sourceMappingURL=template-parameter-regex.js.map