import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { IsSingleLine } from '@idl/parsing/syntax-validators';
import { MainLevelToken, TOKEN_NAMES } from '@idl/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import { PrepareNotebookCellResponse } from '@idl/vscode/events/messages';
import copy from 'fast-copy';

import { BATCH_CELL_TOKENS } from './prepare-notebook-cell.interface';

/**
 * Processes a notebook cell and prepares it to be run
 */
export async function PrepareNotebookCell(
  parsed: IParsed,
  text: string
): Promise<PrepareNotebookCellResponse> {
  /** Get array of strings */
  const strings = text.split(/\r?\n/g);

  /**
   * Flag if we have a main level program or not
   */
  let hasMain = true;

  /**
   * Do we have an empty main level program?
   */
  let emptyMain = false;

  /**
   * Are we a batch file
   */
  let isBatch = false;

  // determine how to handle the code
  switch (true) {
    /**
     * Check if we have a main level
     */
    case parsed.tree[parsed.tree.length - 1]?.name === TOKEN_NAMES.MAIN_LEVEL: {
      hasMain = true;

      /** Get the main level token */
      const mainToken = parsed.tree[
        parsed.tree.length - 1
      ] as TreeToken<MainLevelToken>;

      // determine how to handle the main level
      switch (true) {
        // check if we only have comments or executive commands
        case mainToken.kids.filter((token) => token.name in BATCH_CELL_TOKENS)
          .length === mainToken.kids.length:
          isBatch = true;
          break;

        // if it is a single line, just close
        case IsSingleLine(mainToken):
          strings.push('end');
          break;

        default:
          {
            /**
             * Get problem codes
             */
            const codes = parsed.parseProblems.map((problem) => problem.code);

            // check special cases
            for (let i = 0; i < codes.length; i++) {
              // check for missing end to the main level program
              if (codes[i] === IDL_PROBLEM_CODES.MISSING_MAIN_END) {
                strings.push('end');
                break;
              }

              // check for empty main
              if (codes[i] === IDL_PROBLEM_CODES.EMPTY_MAIN) {
                emptyMain = true;
                break;
              }
            }
          }
          break;
      }
      break;
    }
    default:
      hasMain = false;
      break;
  }

  /**
   * Get Code without print statements
   */
  const withoutPrint = copy(strings);

  // update lines for implied print
  const update = parsed.parseProblems.filter(
    (prob) => prob.code === IDL_PROBLEM_CODES.IMPLIED_PRINT_NOTEBOOK
  );

  // manipulate lines
  for (let i = 0; i < update.length; i++) {
    strings[update[i].start[0]] = `print, ${strings[update[i].start[0]]}`;
    strings[update[i].end[0]] = `${strings[update[i].end[0]]}, /implied_print`;
  }

  // add print for any variables that we need to print
  const asVars = parsed.semantic.notProcedure;
  for (let i = 0; i < asVars.length; i++) {
    strings[asVars[i][0]] = `print, ${strings[asVars[i][0]]}, /implied_print`;
  }

  return {
    offset: 0,
    code: strings.join('\n'),
    hasMain,
    emptyMain,
    isBatch,
    codeWithoutPrint: withoutPrint.join('\n'),
  };
}
