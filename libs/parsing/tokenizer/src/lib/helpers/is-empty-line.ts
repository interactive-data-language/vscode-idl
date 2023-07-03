/**
 * Regex to test if a line is not empty.
 *
 * Using this regex will find the first non-space character in a string
 */
export const NOT_EMPTY_LINE_REGEX = /[^\s\r\n]/;

/**
 * Determines if a line of code is empty or not
 */
export function IsEmptyLine(line: string) {
  return !NOT_EMPTY_LINE_REGEX.test(line);
}
