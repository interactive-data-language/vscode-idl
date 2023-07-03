import { REGEX_NEW_LINE } from '../utils/regex';

/**
 * Removes excess spaces and all new lines from IDL output
 */
export function CleanIDLOutput(output: string) {
  return output.trim().replace(REGEX_NEW_LINE, '');
}
