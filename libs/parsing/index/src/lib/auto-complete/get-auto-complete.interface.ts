import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { CALL_ROUTINE_TOKENS } from '../helpers/get-keywords.interface';

/**
 * Places that we can send procedure methods
 */
export const CAN_PROCEDURE_HERE: { [key: string]: boolean } = {};
CAN_PROCEDURE_HERE[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.MAIN_LEVEL] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.LOOP_DO] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.LOOP_REPEAT] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.BLOCK] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.LOGICAL_THEN] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.LOGICAL_ELSE] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = true;
CAN_PROCEDURE_HERE[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = true;

/** Where can we send completion for procedures? */
export const PROCEDURES: { [key: string]: boolean } = { ...CAN_PROCEDURE_HERE };
PROCEDURES[TOKEN_NAMES.CALL_PROCEDURE] = true;
PROCEDURES[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = true;

/** Function tokens for customized property behavior */
export const ROUTINES: { [key: string]: boolean } = {};
ROUTINES[TOKEN_NAMES.CALL_FUNCTION] = true;
ROUTINES[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
ROUTINES[TOKEN_NAMES.CALL_PROCEDURE] = true;
ROUTINES[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/** Tokens that are functions */
export const FUNCTION_TOKENS: { [key: string]: boolean } = {};
FUNCTION_TOKENS[TOKEN_NAMES.CALL_FUNCTION] = true;
FUNCTION_TOKENS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

/** Tokens that are procedures */
export const PROCEDURE_TOKENS: { [key: string]: boolean } = {};
PROCEDURE_TOKENS[TOKEN_NAMES.CALL_PROCEDURE] = true;
PROCEDURE_TOKENS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

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
 * When can we send all methods
 */
export const ALL_METHODS_COMPLETION: { [key: string]: boolean } = {};
ALL_METHODS_COMPLETION[TOKEN_NAMES.DOT] = true;
ALL_METHODS_COMPLETION[TOKEN_NAMES.ARROW] = true;
ALL_METHODS_COMPLETION[TOKEN_NAMES.ACCESS_PROPERTY] = true;
ALL_METHODS_COMPLETION[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Tokens that indicate we should send only function method completion items
 */
export const FUNCTION_METHOD_COMPLETION: { [key: string]: boolean } = {};
FUNCTION_METHOD_COMPLETION[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
FUNCTION_METHOD_COMPLETION[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

/**
 * Tokens that indicate we can send procedure methods
 */
export const PROCEDURE_METHOD_COMPLETION: { [key: string]: boolean } = {};
PROCEDURE_METHOD_COMPLETION[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;
PROCEDURE_METHOD_COMPLETION[TOKEN_NAMES.ACCESS_PROPERTY] = true;
PROCEDURE_METHOD_COMPLETION[TOKEN_NAMES.DOT] = true;
PROCEDURE_METHOD_COMPLETION[TOKEN_NAMES.ARROW] = true;

/**
 * When we don't send properties
 */
export const NO_PROPERTIES: { [key: string]: boolean } = {};
NO_PROPERTIES[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
NO_PROPERTIES[TOKEN_NAMES.ARROW] = true;
NO_PROPERTIES[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

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
export const KEYWORD_COMPLETION = { ...CALL_ROUTINE_TOKENS, ...KEYWORDS };
KEYWORD_COMPLETION[TOKEN_NAMES.COMMA] = true;
