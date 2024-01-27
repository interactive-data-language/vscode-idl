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
