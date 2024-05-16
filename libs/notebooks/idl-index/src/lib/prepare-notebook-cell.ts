import { IParsed, TreeBranchToken } from '@idl/parsing/syntax-tree';
import { IsSingleLine } from '@idl/parsing/syntax-validators';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import { PrepareNotebookCellResponse } from '@idl/vscode/events/messages';
import copy from 'fast-copy';

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

  // check for main level program
  if (parsed.tree[parsed.tree.length - 1]?.name === TOKEN_NAMES.MAIN_LEVEL) {
    hasMain = true;

    // check if we are a single line
    if (IsSingleLine(parsed.tree[parsed.tree.length - 1] as TreeBranchToken)) {
      strings.push('end');
    } else {
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
  } else {
    hasMain = false;
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
    codeWithoutPrint: withoutPrint.join('\n'),
  };
}
