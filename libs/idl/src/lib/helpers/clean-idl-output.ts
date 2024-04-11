import { REGEX_CLEAN_IDL_OUTPUT, REGEX_NEW_LINE } from '../utils/regex';

/**
 * Removes excess spaces, new lines, and compiled/restored statements
 * from IDL's output
 */
export function CleanIDLOutput(output: string) {
  return output
    .trim()
    .replace(REGEX_CLEAN_IDL_OUTPUT, '')
    .replace(REGEX_NEW_LINE, '');
}
