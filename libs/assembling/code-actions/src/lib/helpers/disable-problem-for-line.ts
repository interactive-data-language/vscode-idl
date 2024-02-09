import {
  AutoFixProblem,
  DISABLED_PROBLEM_FLAGS,
  IS_LINE_DISABLED,
} from '@idl/types/problem-codes';

import { GetIndentLevel } from './get-indent-level';

/**
 * Creates an edit that can be used to automatically fix a code action to
 * disable a problem code for a line
 */
export function DisableProblemForLine(
  line: number,
  alias: string,
  code: string[],
  lf: string,
  cell?: number
): AutoFixProblem {
  /** Get the code we inject */
  let inject = `; ${DISABLED_PROBLEM_FLAGS.NEXT} ${alias}`;

  /** Line we update content for */
  let replaceLine = line;

  // make sure we arent on the first line
  if (line !== 0) {
    /** Get line before */
    const before = code[line - 1];

    /** Check for existing problem code */
    const existingMatch = IS_LINE_DISABLED.exec(before);
    if (existingMatch !== null) {
      /** Get args */
      const args = existingMatch[1]
        .toLowerCase()
        .split(/,/g)
        .map((arg) => arg.trim())
        .filter((arg) => arg !== '');

      // add new arg if it doesnt exist
      if (args.indexOf(alias) === -1) {
        args.push(alias);
      }

      /** build sting to inject */
      inject = `${before.substring(0, existingMatch.index)}; ${
        DISABLED_PROBLEM_FLAGS.NEXT
      } ${args.join(', ')}`;

      // update the line we replace
      replaceLine = line - 1;
    } else {
      /** Match indent of current line */
      const indent = GetIndentLevel(code[line]);

      /** Make text to inject */
      inject = `${indent}; ${DISABLED_PROBLEM_FLAGS.NEXT} ${alias}${lf}${code[line]}`;
    }
  }

  /** Build our edit */
  return [{ line: replaceLine, text: inject, cell }];
}
