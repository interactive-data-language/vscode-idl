import { IParsed } from '@idl/parsing/syntax-tree';
import { IDisabledProblems, IDLProblemCode } from '@idl/types/problem-codes';

/**
 * Checks if a problem for a line should be disabled
 */
export function IsProblemDisabled(
  code: IDLProblemCode,
  line: number,
  disabled: IDisabledProblems
) {
  // check if all are disabled
  if (disabled.all) {
    return true;
  }

  // check if its disabled by file
  if (code in disabled.forFile) {
    return true;
  }

  // check if disabled for our line
  if (line in disabled.forLines) {
    if (code in disabled.forLines[line]) {
      return true;
    }
  }

  return false;
}

/**
 * For reported problems, applies our disabled problems
 */
export function ApplyDisabledProblems(parsed: IParsed) {
  // process parsed problems
  for (let i = 0; i < parsed.parseProblems.length; i++) {
    parsed.parseProblems[i].canReport = !parsed.parseProblems[i].canReport
      ? false
      : !IsProblemDisabled(
          parsed.parseProblems[i].code,
          parsed.parseProblems[i].start[0],
          parsed.disabledProblems
        );
  }

  // process post-process problems
  for (let i = 0; i < parsed.postProcessProblems.length; i++) {
    parsed.postProcessProblems[i].canReport = !parsed.postProcessProblems[i]
      .canReport
      ? false
      : !IsProblemDisabled(
          parsed.postProcessProblems[i].code,
          parsed.postProcessProblems[i].start[0],
          parsed.disabledProblems
        );
  }
}
