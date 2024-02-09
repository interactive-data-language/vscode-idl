import {
  AutoFixProblem,
  DISABLED_PROBLEM_FLAGS,
  IS_FILE_DISABLED,
} from '@idl/types/problem-codes';

/**
 * Creates an edit that can be used to automatically fix a code action to
 * disable a problem code for a line
 */
export function DisableProblemForFile(
  line: number,
  alias: string,
  code: string[],
  lf: string,
  cell?: number
): AutoFixProblem {
  /** Get the code we inject */
  let inject = `;+${lf}; ${DISABLED_PROBLEM_FLAGS.ALL} ${alias}${lf};-${lf}${lf}${code[0]}`;

  /** Line we update content for */
  let replaceLine = 0;

  // check for existing idl-disable line
  for (let i = 0; i < code.length; i++) {
    // look for existing item
    const match = IS_FILE_DISABLED.exec(code[i]);

    // check if match
    if (match !== null) {
      // verify we have args and not just empty space
      const argsString = match[1].trim();
      if (argsString) {
        /** Get args */
        const args = argsString
          .toLowerCase()
          .split(/,/g)
          .map((arg) => arg.trim())
          .filter((arg) => arg !== '');

        // add new arg if it doesnt exist
        if (args.indexOf(alias) === -1) {
          inject = `${code[i]}, ${alias}`;
          replaceLine = i;
          break;
        }
      }
    }
  }

  /** Build our edit */
  return [{ line: replaceLine, text: inject, cell }];
}
