import { REGEX_CLEAN_IDL_OUTPUT, REGEX_NEW_LINE } from '../utils/regex';

/**
 * Removes excess spaces, new lines, and compiled/restored statements
 * from IDL's output
 *
 * If not a full clean, compile and restore statements are preserved
 */
export function CleanIDLOutput(output: string, full = true) {
  if (full) {
    return output
      .trim()
      .replace(REGEX_CLEAN_IDL_OUTPUT, '')
      .replace(REGEX_NEW_LINE, '');
  } else {
    return output.trim().replace(REGEX_NEW_LINE, '');
  }
}
