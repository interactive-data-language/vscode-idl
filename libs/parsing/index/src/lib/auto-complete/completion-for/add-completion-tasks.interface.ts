/**
 * Regex to detect ENVI or IDL task function
 */
export const TASK_FUNCTION_REGEX = /^(?:envi|idl)task/i;

/**
 * Regex to just detect ENVI Task function calls
 */
export const ENVI_TASK_REGEX = /^envi.+task$/i;

/**
 * Regex to just detect IDL Task function calls
 */
export const IDL_TASK_REGEX = /^idl.+task$/i;
