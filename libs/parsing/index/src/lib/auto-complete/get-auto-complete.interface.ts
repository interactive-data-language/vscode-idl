import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { CALL_ROUTINE_TOKENS } from '../helpers/get-keywords.interface';

/** Where can we send completion for procedures? */
export const PROCEDURES: { [key: string]: boolean } = {};
PROCEDURES[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
PROCEDURES[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
PROCEDURES[TOKEN_NAMES.CALL_PROCEDURE] = true;
PROCEDURES[TOKEN_NAMES.MAIN_LEVEL] = true;
PROCEDURES[TOKEN_NAMES.LOOP_DO] = true;
PROCEDURES[TOKEN_NAMES.LOOP_REPEAT] = true;
PROCEDURES[TOKEN_NAMES.BLOCK] = true;
PROCEDURES[TOKEN_NAMES.LOGICAL_THEN] = true;
PROCEDURES[TOKEN_NAMES.LOGICAL_ELSE] = true;
PROCEDURES[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = true;
PROCEDURES[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = true;
PROCEDURES[TOKEN_NAMES.ACCESS_PROPERTY] = true;
PROCEDURES[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;
PROCEDURES[TOKEN_NAMES.CALL_PROCEDURE] = true;
PROCEDURES[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = true;

/** Function tokens for customized property behavior */
export const FUNCTIONS: { [key: string]: boolean } = {};
FUNCTIONS[TOKEN_NAMES.CALL_FUNCTION] = true;
FUNCTIONS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

/** Tokens that represent keywords */
export const KEYWORDS: { [key: string]: boolean } = {};
KEYWORDS[TOKEN_NAMES.KEYWORD] = true;
KEYWORDS[TOKEN_NAMES.KEYWORD_BINARY] = true;

/**
 * When can we send method help?
 *
 * Shouldn't overlap with KEYWORD_COMPLETION
 */
export const METHOD_PROPERTY_COMPLETION: { [key: string]: boolean } = {};
METHOD_PROPERTY_COMPLETION[TOKEN_NAMES.DOT] = true;
METHOD_PROPERTY_COMPLETION[TOKEN_NAMES.ARROW] = true;
METHOD_PROPERTY_COMPLETION[TOKEN_NAMES.ACCESS_PROPERTY] = true;
METHOD_PROPERTY_COMPLETION[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
METHOD_PROPERTY_COMPLETION[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
METHOD_PROPERTY_COMPLETION[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * When we don't send properties
 */
export const NO_PROPERTIES: { [key: string]: boolean } = {};
NO_PROPERTIES[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
// NO_PROPERTIES[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
// NO_PROPERTIES[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * When we have a method, but we need to check if we are inside the start
 * and should alter what auto-complete we send
 */
export const METHOD_INTERIOR_CHECK: { [key: string]: boolean } = {};
METHOD_INTERIOR_CHECK[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
METHOD_INTERIOR_CHECK[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

/**
 * When we don't add parentheses for function or function method calls
 */
export const NO_PAREN: { [key: string]: boolean } = {};
NO_PAREN[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
NO_PAREN[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
NO_PAREN[TOKEN_NAMES.CALL_FUNCTION] = true;
NO_PAREN[TOKEN_NAMES.PARENTHESES] = true;

/**
 * When can we send keyword help
 *
 * Shouldn't overlap with METHOD_PROPERTY_COMPLETION
 */
export const KEYWORD_COMPLETION = copy(CALL_ROUTINE_TOKENS);
