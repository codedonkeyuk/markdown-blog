const templateParameterRegex = (token: string): RegExp =>
  new RegExp(
    `<!--INJECT-${token}-START-->[\\s\\S]*?<!--INJECT-${token}-END-->`,
    "g",
  );

export default templateParameterRegex;
