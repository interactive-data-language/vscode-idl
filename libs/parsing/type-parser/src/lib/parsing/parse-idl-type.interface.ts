/**
 * Regular expression for parsing types
 *
 * TODO: Broken, because we need recursion so we need code parsing
 */
export const TYPE_REGEX = /([a-z_0-9$!'"=]+)\s*(?:<([^>]*)>)?\s*\|?/im;

/**
 * Regular expression for parsing type documentation that is used
 * to nicely split parsed docs without using commas
 */
export const TYPE_DOCS_REGEX =
  /((?:[a-z_0-9$!'"=.+\-_]+\s*(?:<.*>)?\s*\|?\s*)+)/im;

/**
 * Regular expression to split on type args
 */
export const TYPE_ARGS_REGEX = /((?:[a-z_0-9$!'"=]+\s*(?:<.+>)?\s*\|?)*),/im;

/**
 * Regular expression to detect ENVI or IDL tasks so we can nicely format the display name
 */
export const TASK_REGEX = /^(?:ENVI|IDL)(.+)Task$/i;

/**
 * !!Global regular expression and different capture groups than TASK_REGEX!!
 *
 * Regular expression to detect ENVI or IDL tasks so we can nicely format the display name
 */
export const TASK_REGEX_GLOBAL = /(ENVI|IDL)([_a-z0-9]+)Task/gim;
