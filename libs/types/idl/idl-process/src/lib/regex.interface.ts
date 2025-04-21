/**
 * Detects end of line
 */
export const REGEX_LINE_END = /\r*\n$/;

/**
 * Cross-platform regex for new line characters
 */
export const REGEX_NEW_LINE = /\r*\n/gm;

/**
 * Matches new line characters and additional species after them
 */
export const REGEX_NEW_LINE_COMPRESS = /\r*\n\s*/gm;

/**
 * Regex to detect a string comprised of just new lines
 */
export const REGEX_EMPTY_LINE = /^\n\r?$|^\r?\n$/;

/**
 * Regex when we are back at the IDL or ENVI prompt
 */
export const REGEX_IDL_PROMPT = /\r*\n*(?:I\s*D\s*L\s*|E\s*N\s*V\s*I\s*)>\s*$/;

/**
 * Regex to detect stops
 *
 * First group: Reason
 * Second group: routine
 * Third group: line
 * Fourth group: file
 */
export const REGEX_STOP_DETECTION =
  /(% Breakpoint at|% Stepped to|% Stop encountered|% Execution halted at|% Interrupted at)\s*:\s*([a-z_][a-z_0-9$:]*|[a-z_][a-z_0-9$:]*\s*[a-z_][a-z_0-9$:]*|\$main\$)\s*([0-9]+)\s*(.*(?:\s.*.pro)?)/gim;

/**
 * Basic regex to check output from IDL to see if we have stopped
 */
export const REGEX_STOP_DETECTION_BASIC =
  /(% Breakpoint at|% Stepped to|% Stop encountered|% Execution halted at|% Interrupted at)\s*:/gim;

// /**
//  * Regex to detect stops
//  */
// export const REGEX_STOP_DETECTION = new RegExp(
//   `(${SpacifyRegex('% Breakpoint at')}|${SpacifyRegex(
//     '% Stepped to'
//   )}|${SpacifyRegex('% Stop encountered')}|${SpacifyRegex(
//     '% Execution halted at'
//   )}|${SpacifyRegex(
//     '% Interrupted at'
//   )}) *: *([a-z_][a-z_0-9$:]*|[a-z_][a-z_0-9$:]* *[a-z_][a-z_0-9$:]*|\\$main\\$) *([0-9]+) *(.*)`,
//   'gim'
// );

/**
 * Detects compilation errors in IDL's output
 *
 * First group: File + line
 * Second group: File
 * Third group: Line
 */
export const REGEX_COMPILE_ERROR =
  /% Syntax error\.\s*At:(\s*([^,]*),\s*Line\s*([0-9]*))/gim;

/**
 * Detects locations in IDL's output
 *
 * First group: File + line
 * Second group: File
 * Third group: Line
 */
export const REGEX_IDL_LOCATION = /At:(\s*([^,]*),\s*Line\s*([0-9]*))/gim;

/**
 * Detect commands to reset IDL
 */
export const REGEX_IDL_RESTART = /^.f|^.res/gim;

/**
 * Detect commands to exit IDL
 */
export const REGEX_IDL_EXIT = /\bexit\b/gim;

/**
 * Detect commands to exit IDL
 */
export const REGEX_IDL_LINE_CONTINUATION = /\s*\$\s*$/gim;

/**
 * Regex to detect return statements
 */
export const REGEX_IDL_RETALL = /^retall|^return/gim;

/**
 * Tests a command for .compile
 *
 * Does not open the file is we pass "-v" which comes from clicking buttons
 */
export const REGEX_COMPILE_COMMAND = /^\s*\.(com|comp|compi|compil|compile)\s/i;

/**
 * Tests a command for .compile and excludes when we pass in the "-v" flag
 * which comes from clicking buttons to match eclipse
 *
 * This is necessary because we dont need to open files we are manually compiling
 */
export const REGEX_COMPILE_EDIT_COMMAND =
  /^\s*\.(com|comp|compi|compil|compile)\s(?!-v)/i;

/**
 * Regex for detecting .edit
 */
export const REGEX_EDIT_COMMAND = /^\s*\.(e|ed|edi|edit)\s/i;

/**
 * Regex that indicates we have compiled a main level program
 */
export const REGEX_COMPILED_MAIN = /% Compiled module: \$MAIN\$\./im;

/**
 * Regex to detect compile and restore statements so we can
 * remove them from IDL's output
 */
export const REGEX_CLEAN_IDL_OUTPUT =
  /^% (?:Compiled module|Restored file):.*$/gim;
