import { DISABLED_PROBLEM_REGEX } from '@idl/types/problem-codes';

/**
 * Cleans a comment by removing any information about disabled comments
 * and trims the right side
 */
export function CleanComment(comment: string) {
  return comment.replace(DISABLED_PROBLEM_REGEX, '').trimEnd();
}
