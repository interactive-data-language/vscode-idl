import {
  ITokenDef,
  StringTemplateEscape,
  StringTemplateExpression,
  StringTemplateLiteral,
  StringTemplateString,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type StringTemplateLiteralTokenDef = ITokenDef<StringTemplateLiteral>;

/**
 * Token for string templates
 */
export const STRING_TEMPLATE_LITERAL: StringTemplateLiteralTokenDef = {
  name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
  match: /`/im,
  end: /`/im,
};

export type StringTemplateStringTokenDef = ITokenDef<StringTemplateString>;

/**
 * Token to extract the string portion of a template literal
 */
export const STRING_TEMPLATE_STRING: StringTemplateStringTokenDef = {
  name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
  match: /.+?(?=\\|(?<!\\)`|$|\${)/im,
};

export type StringTemplateExpressionTokenDef =
  ITokenDef<StringTemplateExpression>;

/**
 * Token for the expressions within template literals
 */
export const STRING_TEMPLATE_EXPRESSION: StringTemplateExpressionTokenDef = {
  name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
  match: /\${/im,
  end: /}/im,
};

export type StringTemplateEscapeTokenDef = ITokenDef<StringTemplateEscape>;

/**
 * Token for string template escape characters
 */
export const STRING_TEMPLATE_ESCAPE: StringTemplateEscapeTokenDef = {
  name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
  match: /\\(?:[\\bfnrtv$`]|x[a-f0-9]{2})?/im,
};
