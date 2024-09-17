import { TOKEN_NAMES } from '@idl/tokenizer';

/**
 * Regex to detect auto complete for special functions
 */
export const SPECIAL_FUNCTION_REGEX = /(?:envi|idl)task|obj_new|call_function/i;

/**
 * Regex to just detect ENVI Task function calls
 */
export const ENVI_TASK_REGEX = /^envi.+task$/i;

/**
 * Regex to just detect IDL Task function calls
 */
export const IDL_TASK_REGEX = /^idl.+task$/i;

/**
 * Track tokens that we can do task completion for
 */
export const ALLOWED_SPECIAL_COMPLETION: { [key: string]: undefined } = {};
ALLOWED_SPECIAL_COMPLETION[TOKEN_NAMES.QUOTE_SINGLE] = undefined;
ALLOWED_SPECIAL_COMPLETION[TOKEN_NAMES.QUOTE_DOUBLE] = undefined;
ALLOWED_SPECIAL_COMPLETION[TOKEN_NAMES.STRING_TEMPLATE_LITERAL] = undefined;
