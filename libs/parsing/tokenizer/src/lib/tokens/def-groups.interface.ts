import { ITokenDef, TOKEN_NAMES, TokenName } from '../tokens.interface';
import { ACCESS_PROPERTY } from './defs/access-property.interface';
import { ASSIGNMENT } from './defs/assignment.interface';
import { BLOCK } from './defs/block.interface';
import { MAIN_LEVEL_END, UNEXPECTED_CLOSER } from './defs/closers.interface';
import { COLON } from './defs/colon.interface';
import { COMMA } from './defs/commas.interface';
import { COMMENT } from './defs/comment.interface';
import { CONTROL_BASIC, CONTROL_COMPOUND } from './defs/control.interface';
import { EXECUTIVE_COMMAND } from './defs/executive-commands.interface';
import { GROUPERS } from './defs/groupers.interface';
import { INCLUDE } from './defs/include.interface';
import {
  BASIC_LINE_SEPARATOR,
  LINE_CONTINUATION,
  LINE_SEPARATOR,
} from './defs/line-modifiers.interface';
import {
  CASE_SWITCH_THEN,
  LOGICAL_CASE_SWITCH,
  LOGICAL_IF,
  LOGICAL_OF,
  TERNARY_ELSE,
  TERNARY_THEN,
} from './defs/logical.interface';
import { LOOP_SECONDARY, LOOP_START } from './defs/loops.interface';
import { NUMBER } from './defs/numbers.interface';
import { OPERATOR } from './defs/operators.interface';
import { PROMPT } from './defs/prompt.interface';
import { PYTHON } from './defs/python.interface';
import { QUOTE_DOUBLE, QUOTE_SINGLE } from './defs/quotes.interface';
import {
  CALL_FUNCTION,
  CALL_FUNCTION_METHOD,
  CALL_PRO,
  CALL_PRO_METHOD,
} from './defs/routines.call.interface';
import { ROUTINE_DEF } from './defs/routines.definition.interface';
import { STRING_TEMPLATE_LITERAL } from './defs/string-templates.interface';
import {
  STRUCTURE_INDEXED_PROPERTY,
  STRUCTURE_INHERITANCE,
  STRUCTURE_NAME,
  STRUCTURE_PROPERTY,
} from './defs/structure.interface';
import { VARIABLE } from './defs/variables.interface';

/**
 * First pass tokens when we are processing the beginning
 * of a string.
 */
export const ALL_TOKENS: ITokenDef<TokenName>[] = [
  PROMPT,
  EXECUTIVE_COMMAND,
  ROUTINE_DEF,
  ASSIGNMENT,
  OPERATOR,
  LINE_CONTINUATION,
  LINE_SEPARATOR,
  LOOP_START,
  LOGICAL_IF,
  LOGICAL_CASE_SWITCH,
  BLOCK,
  CALL_FUNCTION,
  CALL_FUNCTION_METHOD,
  CALL_PRO_METHOD,
  ACCESS_PROPERTY,
  STRUCTURE_INDEXED_PROPERTY,
  NUMBER,
  CONTROL_BASIC,
  CONTROL_COMPOUND,
  GROUPERS,
  MAIN_LEVEL_END,
  UNEXPECTED_CLOSER,
  CALL_PRO,
  VARIABLE,
  QUOTE_SINGLE,
  QUOTE_DOUBLE,
  STRING_TEMPLATE_LITERAL,
  COMMENT,
  INCLUDE,
  PYTHON,
];

/**
 * Tokens we exclude from our default tokens
 */
const DEFAULT_EXCLUDE: { [key: string]: any } = {};
DEFAULT_EXCLUDE[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
DEFAULT_EXCLUDE[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
DEFAULT_EXCLUDE[TOKEN_NAMES.MAIN_LEVEL_END] = true;
DEFAULT_EXCLUDE[TOKEN_NAMES.EXECUTIVE_COMMAND] = true;
DEFAULT_EXCLUDE[TOKEN_NAMES.PROMPT] = true;

/**
 * Tokens we look for when we are in a routine definition
 */
export const DEFAULT_TOKENS = ALL_TOKENS.filter(
  (token) => !(token.name in DEFAULT_EXCLUDE)
);

/**
 * Tokens to use when we have encountered a routine
 */
export const ROUTINE_TOKENS: ITokenDef<TokenName>[] = [
  PYTHON,
  OPERATOR,
  COMMA,
  LINE_CONTINUATION,
  ASSIGNMENT,
  TERNARY_THEN,
  CALL_FUNCTION,
  CALL_FUNCTION_METHOD,
  ACCESS_PROPERTY,
  STRUCTURE_INDEXED_PROPERTY,
  NUMBER,
  GROUPERS,
  UNEXPECTED_CLOSER,
  VARIABLE,
  QUOTE_SINGLE,
  QUOTE_DOUBLE,
  STRING_TEMPLATE_LITERAL,
  COMMENT,
];

/**
 * Tokens to use when we encounter an expression like logical statements, if statements,
 * or portions of loops.
 */
export const EXPRESSION_TOKENS: ITokenDef<TokenName>[] = [
  OPERATOR,
  LINE_CONTINUATION,
  ASSIGNMENT,
  TERNARY_THEN,
  CALL_FUNCTION,
  CALL_FUNCTION_METHOD,
  ACCESS_PROPERTY,
  STRUCTURE_INDEXED_PROPERTY,
  NUMBER,
  GROUPERS,
  UNEXPECTED_CLOSER,
  VARIABLE,
  QUOTE_SINGLE,
  QUOTE_DOUBLE,
  STRING_TEMPLATE_LITERAL,
  COMMENT,
];

/**
 * Tokens found in loops
 */
export const LOOP_TOKENS: ITokenDef<TokenName>[] = [
  LOOP_SECONDARY,
  ...ROUTINE_TOKENS,
];

/**
 * Tokens found in while loops starts
 */
export const LOOP_WHILE_TOKENS: ITokenDef<TokenName>[] = [
  LOOP_SECONDARY,
  ...EXPRESSION_TOKENS,
];

/**
 * Tokens found in repeat loops
 */
export const LOOP_REPEAT_TOKENS: ITokenDef<TokenName>[] = [
  LOOP_SECONDARY,
  ...DEFAULT_TOKENS,
];

/**
 * Tokens to find in routine names
 */
export const ROUTINE_NAME_TOKENS: ITokenDef<TokenName>[] = [
  VARIABLE,
  ASSIGNMENT,
  COMMA,
  LINE_CONTINUATION,
  COMMENT,
  UNEXPECTED_CLOSER,
];

/**
 * Tokens to find in structures
 */
export const STRUCTURE_TOKENS: ITokenDef<TokenName>[] = [
  STRUCTURE_NAME,
  STRUCTURE_INHERITANCE,
  STRUCTURE_PROPERTY,
  COMMA,
  LINE_CONTINUATION,
  COMMENT,
  UNEXPECTED_CLOSER,
];

/**
 * Tokens for named structures
 */
export const NAMED_STRUCTURE_TOKENS: ITokenDef<TokenName>[] = [
  STRUCTURE_INHERITANCE,
  STRUCTURE_PROPERTY,
  ...ROUTINE_TOKENS,
];

/**
 * Tokens to find in brackets
 */
export const BRACKET_TOKENS: ITokenDef<TokenName>[] = [COLON];

/**
 * Tokens for case and switch
 */
export const CASE_SWITCH_TOKENS: ITokenDef<TokenName>[] = [LOGICAL_OF];

/**
 * Tokens when we encounter an expression in case or switch
 */
export const CASE_SWITCH_EXPRESSION_TOKENS: ITokenDef<TokenName>[] = [
  BASIC_LINE_SEPARATOR,
  CASE_SWITCH_THEN,
];

/**
 * Tokens when we encounter a ternary statement
 */
export const TERNARY_TOKENS: ITokenDef<TokenName>[] = [TERNARY_ELSE];

/**
 * Compound tokens with control statements
 */
export const CONTROL_COMPOUND_TOKENS: ITokenDef<TokenName>[] = [
  COMMA,
  VARIABLE,
  LINE_CONTINUATION,
  COMMENT,
  UNEXPECTED_CLOSER,
];
