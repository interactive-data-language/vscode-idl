import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Tracks tokens that increase our indent level while we are processing their children
 */
export const TOKEN_INDENT_INCREASERS: { [key: string]: boolean } = {};
TOKEN_INDENT_INCREASERS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
TOKEN_INDENT_INCREASERS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
TOKEN_INDENT_INCREASERS[TOKEN_NAMES.LOGICAL_OF] = true;
TOKEN_INDENT_INCREASERS[TOKEN_NAMES.BLOCK] = true;
TOKEN_INDENT_INCREASERS[TOKEN_NAMES.STRUCTURE] = true;

/**
 * Tracks tokens that decrease our indent level on close and remove line continuation
 * indents as well
 */
export const TOKEN_INDENT_DECREASE_AFTER: { [key: string]: boolean } = {};
// TOKEN_INDENT_DECREASE_AFTER[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = true;
// TOKEN_INDENT_DECREASE_AFTER[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = true;

/**
 * Tracks tokens to skip from formatting at all
 */
export const SKIP_TOKEN_FORMATTING: { [key: string]: boolean } = {};
SKIP_TOKEN_FORMATTING[TOKEN_NAMES.COMMENT_BLOCK] = true;
SKIP_TOKEN_FORMATTING[TOKEN_NAMES.LINE_SEPARATION] = true;
SKIP_TOKEN_FORMATTING[TOKEN_NAMES.LINE_SEPARATION_BASIC] = true;

/**
 * Tracks tokens to skip from formatting the start of
 */
export const SKIP_FORMATTING_TOKEN_STARTS: { [key: string]: boolean } = {};
SKIP_FORMATTING_TOKEN_STARTS[TOKEN_NAMES.MAIN_LEVEL] = true;

/**
 * Controls when the line continuation flag gets reset upon recursing
 */
export const LINE_CONTINUATION_RESETS: { [key: string]: boolean } = {};
LINE_CONTINUATION_RESETS[TOKEN_NAMES.CALL_FUNCTION] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.LOGICAL_THEN] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.LOGICAL_ELSE] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.ASSIGNMENT] = true;
LINE_CONTINUATION_RESETS[TOKEN_NAMES.PARENTHESES] = true;

/**
 * Controls if the closing statement for a specific type of token remove one level of
 * indentation so they line up with the start of the state.emt or block
 */
export const INDENT_OFFSET_TOKENS: { [key: string]: boolean } = {};
INDENT_OFFSET_TOKENS[TOKEN_NAMES.BLOCK] = true;
INDENT_OFFSET_TOKENS[TOKEN_NAMES.LOGICAL_OF] = true;
INDENT_OFFSET_TOKENS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
INDENT_OFFSET_TOKENS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;

/**
 * Controls when we don't add additional indentation for line continuations for the
 * children of these tokens
 */
export const IGNORE_LINE_CONTINUATION_INDENTS: { [key: string]: boolean } = {};
IGNORE_LINE_CONTINUATION_INDENTS[TOKEN_NAMES.ROUTINE_NAME] = true;
IGNORE_LINE_CONTINUATION_INDENTS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;
IGNORE_LINE_CONTINUATION_INDENTS[TOKEN_NAMES.STRUCTURE] = true;
IGNORE_LINE_CONTINUATION_INDENTS[TOKEN_NAMES.STRUCTURE_NAME] = true;

/**
 * If we have a line continuation, remove the indent level after encounter
 *
 * Meant to fine-tune control in case/switch with really bad formatting
 */
export const REMOVE_LINE_CONTINUATION_INDENTS_ON_OPEN: {
  [key: string]: boolean;
} = {};
REMOVE_LINE_CONTINUATION_INDENTS_ON_OPEN[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] =
  true;
REMOVE_LINE_CONTINUATION_INDENTS_ON_OPEN[
  TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT
] = true;

/**
 * Non-basic tokens that preserve indentation even after they are closed
 *
 * Main use case is having multiple indents for logic statements
 */
export const DONT_RESET_INDENTS_ON_CLOSE: { [key: string]: boolean } = {};
// DONT_RESET_INDENTS_ON_CLOSE[TOKEN_NAMES.OPERATOR] = true;
// DONT_RESET_INDENTS_ON_CLOSE[TOKEN_NAMES.OPERATOR_LOGICAL] = true;

/**
 * When we encounter these tokens, immediately increment the printed IDL code to have
 * the next line.
 *
 * Any tokens encountered here are also *not* formatted.
 *
 * its really just line separators.
 */
export const LINE_INCREMENTERS_ON_DETECT: { [key: string]: boolean } = {};
LINE_INCREMENTERS_ON_DETECT[TOKEN_NAMES.LINE_SEPARATION] = true;
LINE_INCREMENTERS_ON_DETECT[TOKEN_NAMES.LINE_SEPARATION_BASIC] = true;

/**
 * After we close these tokens, add a new line for better visual appearance
 */
export const LINE_INCREMENT_ON_CLOSE: { [key: string]: boolean } = {};
LINE_INCREMENT_ON_CLOSE[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
LINE_INCREMENT_ON_CLOSE[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
