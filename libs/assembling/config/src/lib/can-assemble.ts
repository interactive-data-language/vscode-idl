import { SyntaxProblems } from '@idl/parsing/problem-codes';

import { ASSEMBLER_BLOCKING_PROBLEMS } from './assembler.interface';

/**
 * From parsed code, returns a flag if we can format it or not.
 *
 * This prevents major formatting errors when we have unhandled syntax errors in the
 * code.
 */
export function CanAssemble(problems: SyntaxProblems): boolean {
  // process all of the problem codes
  for (let i = 0; i < problems.length; i++) {
    if (problems[i].code in ASSEMBLER_BLOCKING_PROBLEMS) {
      return false;
    }
  }

  // made it here, so we can return
  return true;
}
