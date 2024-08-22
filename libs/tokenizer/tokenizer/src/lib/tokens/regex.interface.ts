/**
 * What represents an end of A line of IDL code.
 *
 * Should only be used in the FindTokens function and not token defs.
 *
 * Supposed to stop at commas or the end of a line.
 */
export const IDL_LINE_END = /(?=(?<!&)&(?!&))|(?<!\$\s*|\$\s*;.*)$/im;

/**
 * Represents the end of a statement - either the end of a line or
 * stopped by several tokens
 */
export const IDL_STATEMENT_END = /(?=;|(?<!&)&(?!&))|(?<!\$\s*|\$\s*;.*)$/im;

/**
 * Represents the end of a block statement that starts with begin
 */
export const IDL_BLOCK_END =
  /\bendif\b|\bendelse\b|\bendfor\b|\bendforeach\b|\bendrep\b|\bendwhile\b|\bendswitch\b|\bendcase\b|\bend\b/im;

/**
 * Represents the end of an if statements
 */
export const IDL_IF_STATEMENT_END =
  /(?=\buntil\b|;|(?<!&)&(?!&))|(?<!\$\s*|\$\s*;.*)$/im;

/**
 * Represents the end of a statement - either the end of a line or
 * stopped by several tokens
 */
export const IDL_LOGICAL_STATEMENT_END =
  /(?=\buntil\b|\bthen\b|\belse\b|;|(?<!&)&(?!&))|(?<!\$\s*|\$\s*;.*)$/im;

/**
 * Where should assignment stop. Different from statement because it catches
 * commas, parentheses, and ampersand
 */
export const IDL_ASSIGNMENT_END =
  /(?=\buntil\b|\belse\b|\bthen\b|\bdo\b|\bof\b|[),\]};])|(?=(?<!&)&(?!&))|(?<!\$\s*|\$\s*;.*)$/im;

/**
 * Where should operators stop
 *
 * The really complicated expression `(\.|->)([a-z_][a-z0-9_$:]*)(?=\s*(?<!&)&(?!&)|\s*,|\s*;|\s+\$|\s*$)` represents
 * procedure methods
 */
export const IDL_OPERATOR_END =
  /(?=\buntil\b|\belse\b|\bthen\b|\bdo\b|\bof\b|[),\]};?:]|(?=(?<!&)&(?!&))|\|\||\bor\b|(\.|->)([a-z_][a-z0-9_$:]*)(?=\s*(?<!&)&(?!&)|\s*,|\s*;|\s+\$|\s*$))|(?<!\$\s*|\$\s*;.*)$/im;

/**
 * Where should calling a procedure stop
 */
export const IDL_PRO_END =
  /(?=until|else|(?=(?<!&)&(?!&)))|(?<!\$\s*|\$\s*;)$/im;

/**
 * What represents an end of A line of IDL code.
 *
 * Supposed to stop at commas or the end of a line.
 */
export const IDL_ARG_KW_END = /\b(?=,)/im;

/**
 * Regex test which checks for only a comment being presen ton our line
 */
export const COMMENT_ONLY_TEST = /^\s*;/;

/**
 * Regex to find the first, and only the first, non-space character in a string
 */
export const NON_SPACE_CHARACTER = /[^\s\r\n]{1}/i;

/**
 * Regex to check if a single quote is really a number,
 * for example, '10101'b[ubsllij], '777'o[ubsllij], 'FFD'x[ubsllij]
 */
export const NUMBER_AS_SINGLE_QUOTE =
  /'([^']+)'([box])(u?(?:b|s|ll|l|i|j)*)\b/i;

/**
 * Regex to check if a double quote is really a number,
 * for example, "10101"b[ubsllok], "777"o[ubsllok], "FFD"x[ubsllok].
 * Also check for double-quote octals, "777[ubsllok]
 */
export const NUMBER_AS_DOUBLE_QUOTE =
  /"([^"]+)"([box])(u?(?:b|s|ll|l|i|j)*)\b|"([0-7]+)(u?(?:b|s|ll|l|i|j)*)$/i;

/**
 * Regular expression to clean the cleaning regular expression
 */
export const STRUCTURE_PROPERTY_CLEANER_REGEX = /\s*:/im;
