import {
  ITokenDef,
  LogicalCaseSwitchThenToken,
  LogicalCaseToken,
  LogicalElseToken,
  LogicalExpressionDefaultToken,
  LogicalExpressionToken,
  LogicalIfToken,
  LogicalOfToken,
  LogicalSwitchToken,
  LogicalTernaryElseToken,
  LogicalTernaryThenToken,
  LogicalThenToken,
  TOKEN_NAMES,
} from '../../tokens.interface';
import {
  IDL_ASSIGNMENT_END,
  IDL_BLOCK_END,
  IDL_IF_STATEMENT_END,
  IDL_LOGICAL_STATEMENT_END,
  IDL_OPERATOR_END,
  IDL_STATEMENT_END,
} from '../regex.interface';

/**
 * Map the extracted text from regex to
 */
const TOKEN_TYPE_BY_MATCH = {
  then: TOKEN_NAMES.LOGICAL_THEN,
  else: TOKEN_NAMES.LOGICAL_ELSE,
  switch: TOKEN_NAMES.LOGICAL_SWITCH,
  case: TOKEN_NAMES.LOGICAL_CASE,
};

export type LogicalIfTokenDef = ITokenDef<LogicalIfToken>;

/**
 * Regex for if statements
 */
export const LOGICAL_IF: LogicalIfTokenDef = {
  name: TOKEN_NAMES.LOGICAL_IF,
  match: /\bif\b/im,
  end: IDL_IF_STATEMENT_END,
};

export type LogicalThenElseTokenDef = ITokenDef<
  LogicalThenToken | LogicalElseToken
>;

/**
 * Regex to find the then and else part of if statements
 */
export const LOGICAL_THEN_ELSE: LogicalThenElseTokenDef = {
  name: TOKEN_NAMES.LOGICAL_THEN,
  match: /\bthen\b|\belse\b/im,
  end: IDL_LOGICAL_STATEMENT_END,
  getTokenName: (matches) => {
    // verify matches
    if (matches.length !== 1) {
      console.log(`Logical regex did not return one match as expected`);
      return TOKEN_NAMES.LOGICAL;
    }

    // extract compare statement
    const compare = matches[0].toLowerCase();

    // validate it is there
    if (!(compare in TOKEN_TYPE_BY_MATCH)) {
      console.log(`Logical regex did not extract "then" or "else"`);
      return TOKEN_NAMES.LOGICAL;
    }

    return TOKEN_TYPE_BY_MATCH[compare];
  },
};

export type LogicalCaseSwitchTokenDef = ITokenDef<
  LogicalCaseToken | LogicalSwitchToken
>;

/**
 * Regex for case and switch
 */
export const LOGICAL_CASE_SWITCH: LogicalCaseSwitchTokenDef = {
  name: TOKEN_NAMES.LOGICAL_CASE,
  match: /\bcase\b|\bswitch\b/im,
  end: IDL_BLOCK_END,
  getTokenName: (matches) => {
    // verify matches
    if (matches.length !== 1) {
      console.log(`Logical regex did not return one match as expected`);
      return TOKEN_NAMES.LOGICAL;
    }

    // extract compare statement
    const compare = matches[0].toLowerCase();

    // validate it is there
    if (!(compare in TOKEN_TYPE_BY_MATCH)) {
      console.log(`Logical regex did not extract "switch" or "case"`);
      return TOKEN_NAMES.LOGICAL;
    }

    return TOKEN_TYPE_BY_MATCH[compare];
  },
};

export type LogicalOfTokenDef = ITokenDef<LogicalOfToken>;

/**
 * Regex to find the then and else part of if statements
 */
export const LOGICAL_OF: LogicalOfTokenDef = {
  name: TOKEN_NAMES.LOGICAL_OF,
  match: /\bof\b/im,
  end: /(?=\bend)/im,
};

export type LogicalExpressionTokenDef = ITokenDef<LogicalExpressionToken>;

/**
 * Regex to find the start of expressions
 *
 * @deprecated - Causes zero-width starts which causes infinite loop
 */
export const LOGICAL_EXPRESSION: LogicalExpressionTokenDef = {
  name: TOKEN_NAMES.LOGICAL_EXPRESSION,
  match: /(?=[^\s])/im,
  end: IDL_STATEMENT_END,
};

export type LogicalExpressionThenTokenDef = ITokenDef<
  LogicalCaseSwitchThenToken | LogicalExpressionDefaultToken
>;

/**
 * Regex to find the then and else part of if statements
 */
export const CASE_SWITCH_THEN: LogicalExpressionThenTokenDef = {
  name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
  match: /(else\s*)?:/im,
  end: IDL_STATEMENT_END,
  getTokenName: (matches) => {
    if (matches.length === 1) {
      return TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN;
    } else {
      return TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT;
    }
  },
};

export type LogicalTernaryThenTokenDef = ITokenDef<LogicalTernaryThenToken>;

/**
 * Track then portion of ternary operator
 */
export const TERNARY_THEN: LogicalTernaryThenTokenDef = {
  name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
  match: /\?/im,
  end: IDL_ASSIGNMENT_END,
};

export type LogicalTernaryElseTokenDef = ITokenDef<LogicalTernaryElseToken>;

/**
 * Track the else portion of ternary operator
 */
export const TERNARY_ELSE: LogicalTernaryElseTokenDef = {
  name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
  match: /:/im,
  end: IDL_OPERATOR_END,
  closeParentTokenAfterEnd: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
};
