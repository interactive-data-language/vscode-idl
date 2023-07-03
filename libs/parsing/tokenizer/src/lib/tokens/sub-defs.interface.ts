/**
 * This file contains the tokens we search for when we find another token.
 *
 * For example: when we find a string or comment, allwe check for are strings or other comments
 */

import { ITokenDef, TOKEN_NAMES, TokenName } from '../tokens.interface';
import {
  BRACKET_TOKENS,
  CASE_SWITCH_EXPRESSION_TOKENS,
  CASE_SWITCH_TOKENS,
  CONTROL_COMPOUND_TOKENS,
  DEFAULT_TOKENS,
  EXPRESSION_TOKENS,
  LOOP_REPEAT_TOKENS,
  LOOP_TOKENS,
  LOOP_WHILE_TOKENS,
  NAMED_STRUCTURE_TOKENS,
  ROUTINE_NAME_TOKENS,
  ROUTINE_TOKENS,
  STRUCTURE_TOKENS,
  TERNARY_TOKENS,
} from './def-groups.interface';
import { COLON } from './defs/colon.interface';
import { COMMA } from './defs/commas.interface';
import { COMMENT } from './defs/comment.interface';
import { LOGICAL_THEN_ELSE } from './defs/logical.interface';
import { ROUTINE_NAME } from './defs/routines.definition.interface';
import {
  STRING_TEMPLATE_ESCAPE,
  STRING_TEMPLATE_EXPRESSION,
  STRING_TEMPLATE_STRING,
} from './defs/string-templates.interface';

export interface ISubTokenDefs {
  [key: string]: ITokenDef<TokenName>[];
}

/**
 * The tokens we check for when we found a specific token
 */
export const SUB_DEFS: ISubTokenDefs = {};

// routine definitions
SUB_DEFS[TOKEN_NAMES.ROUTINE_FUNCTION] = [ROUTINE_NAME];
SUB_DEFS[TOKEN_NAMES.ROUTINE_PROCEDURE] = [ROUTINE_NAME];
SUB_DEFS[TOKEN_NAMES.ROUTINE_NAME] = ROUTINE_NAME_TOKENS;
SUB_DEFS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = ROUTINE_NAME_TOKENS;

// tokens for assignment
SUB_DEFS[TOKEN_NAMES.ASSIGNMENT] = EXPRESSION_TOKENS;
SUB_DEFS[TOKEN_NAMES.OPERATOR] = EXPRESSION_TOKENS;
SUB_DEFS[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = EXPRESSION_TOKENS;
SUB_DEFS[TOKEN_NAMES.OPERATOR_LOGICAL] = EXPRESSION_TOKENS;
SUB_DEFS[TOKEN_NAMES.LINE_SEPARATION] = DEFAULT_TOKENS;

// handle compound control statements
SUB_DEFS[TOKEN_NAMES.CONTROL_COMMON] = CONTROL_COMPOUND_TOKENS;
SUB_DEFS[TOKEN_NAMES.CONTROL_COMPILE_OPT] = CONTROL_COMPOUND_TOKENS;
SUB_DEFS[TOKEN_NAMES.CONTROL_FORWARD_FUNCTION] = CONTROL_COMPOUND_TOKENS;
SUB_DEFS[TOKEN_NAMES.CONTROL_GO_TO] = CONTROL_COMPOUND_TOKENS;

// handle block statements
SUB_DEFS[TOKEN_NAMES.BLOCK] = DEFAULT_TOKENS;

// handle comments
SUB_DEFS[TOKEN_NAMES.COMMENT] = [];
SUB_DEFS[TOKEN_NAMES.COMMENT_BLOCK] = [COMMENT];

// line continuations can only find comments afterwards
SUB_DEFS[TOKEN_NAMES.LINE_CONTINUATION] = [COMMENT];

// handle quotes where we only look for other quotes
SUB_DEFS[TOKEN_NAMES.QUOTE_SINGLE] = [];
SUB_DEFS[TOKEN_NAMES.QUOTE_DOUBLE] = [];

// handle procedure and procedure methods
SUB_DEFS[TOKEN_NAMES.CALL_PROCEDURE] = ROUTINE_TOKENS;
SUB_DEFS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = ROUTINE_TOKENS;
SUB_DEFS[TOKEN_NAMES.CALL_FUNCTION] = [COLON as ITokenDef<TokenName>].concat(
  ROUTINE_TOKENS
);
SUB_DEFS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = [
  COLON as ITokenDef<TokenName>,
].concat(ROUTINE_TOKENS);

// handle lambda functions as special case
SUB_DEFS[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = [
  COLON as ITokenDef<TokenName>,
].concat(ROUTINE_TOKENS);

// handle tokens that we allow in loops
SUB_DEFS[TOKEN_NAMES.LOOP] = LOOP_TOKENS;
SUB_DEFS[TOKEN_NAMES.LOOP_FOR] = LOOP_TOKENS;
SUB_DEFS[TOKEN_NAMES.LOOP_FOREACH] = LOOP_TOKENS;
SUB_DEFS[TOKEN_NAMES.LOOP_REPEAT] = LOOP_REPEAT_TOKENS;
SUB_DEFS[TOKEN_NAMES.LOOP_WHILE] = LOOP_WHILE_TOKENS;

// special cases for repeat and the "do" portion of loops which
// are basically new lines
SUB_DEFS[TOKEN_NAMES.LOOP_DO] = DEFAULT_TOKENS;
SUB_DEFS[TOKEN_NAMES.LOOP_UNTIL] = EXPRESSION_TOKENS;

// logic statements
SUB_DEFS[TOKEN_NAMES.LOGICAL_IF] = [
  LOGICAL_THEN_ELSE as ITokenDef<TokenName>,
].concat(EXPRESSION_TOKENS);
SUB_DEFS[TOKEN_NAMES.LOGICAL_THEN] = DEFAULT_TOKENS;
SUB_DEFS[TOKEN_NAMES.LOGICAL_ELSE] = DEFAULT_TOKENS;

// switch and case starts
SUB_DEFS[TOKEN_NAMES.LOGICAL_SWITCH] =
  CASE_SWITCH_TOKENS.concat(EXPRESSION_TOKENS);
SUB_DEFS[TOKEN_NAMES.LOGICAL_CASE] =
  CASE_SWITCH_TOKENS.concat(EXPRESSION_TOKENS);

// switch and case sub-statements
SUB_DEFS[TOKEN_NAMES.LOGICAL_OF] =
  CASE_SWITCH_EXPRESSION_TOKENS.concat(EXPRESSION_TOKENS);
// SUB_DEFS[TOKEN_LOOKUP.LOGICAL_EXPRESSION] =
//   CASE_SWITCH_EXPRESSION_TOKENS.concat(ROUTINE_TOKENS);
// SUB_DEFS[TOKEN_LOOKUP.LOGICAL_EXPRESSION_DEFAULT] = DEFAULT_TOKENS;

// ternary tokens
SUB_DEFS[TOKEN_NAMES.LOGICAL_TERNARY_THEN] =
  TERNARY_TOKENS.concat(EXPRESSION_TOKENS);
SUB_DEFS[TOKEN_NAMES.LOGICAL_TERNARY_ELSE] = EXPRESSION_TOKENS;

// disable procedures for grouping statements
SUB_DEFS[TOKEN_NAMES.PARENTHESES] = EXPRESSION_TOKENS;
SUB_DEFS[TOKEN_NAMES.BRACKET] = BRACKET_TOKENS.concat(ROUTINE_TOKENS);

// tokens for structures
SUB_DEFS[TOKEN_NAMES.STRUCTURE] = STRUCTURE_TOKENS;
SUB_DEFS[TOKEN_NAMES.STRUCTURE_NAME] = NAMED_STRUCTURE_TOKENS;
SUB_DEFS[TOKEN_NAMES.STRUCTURE_PROPERTY] = ROUTINE_TOKENS;

// template strings
SUB_DEFS[TOKEN_NAMES.STRING_TEMPLATE_LITERAL] = [
  STRING_TEMPLATE_ESCAPE,
  STRING_TEMPLATE_EXPRESSION,
  STRING_TEMPLATE_STRING,
];
SUB_DEFS[TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION] = [
  ...EXPRESSION_TOKENS,
  COMMA,
];
