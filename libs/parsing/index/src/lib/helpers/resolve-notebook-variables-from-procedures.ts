import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { BRANCH_TYPES, IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  MainLevelToken,
  TOKEN_NAMES,
  VariableToken,
} from '@idl/parsing/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

/**
 * Display names for procedures
 */
const PROCEDURES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE];

/**
 * Converts procedure calls to variables for implied print in
 * main level programs in notebook cells
 */
export function ResolveNotebookVariablesFromProcedures(parsed: IParsed) {
  /**
   * Get the main level
   */
  const main = parsed.tree.find(
    (item) => item.name === TOKEN_NAMES.MAIN_LEVEL
  ) as TreeToken<MainLevelToken> | undefined;

  // check if main
  if (main !== undefined) {
    for (let i = 0; i < main.kids.length; i++) {
      if (main.kids[i].name === TOKEN_NAMES.CALL_PROCEDURE) {
        /** Get name of procedure */
        const proName = main.kids[i].match[0].toLowerCase();

        if (!(proName in PROCEDURES) && proName in parsed.local.main) {
          /** Crete new variable token */
          const varToken: TreeToken<VariableToken> = {
            type: BRANCH_TYPES.BASIC,
            name: TOKEN_NAMES.VARIABLE,
            idx: i,
            match: [main.kids[i].match[0]],
            pos: main.kids[i].pos,
            parseProblems: [],
            scope: [TOKEN_NAMES.MAIN_LEVEL],
          };

          // track additional usage
          parsed.local.main[proName].meta.usage.push(main.kids[i].pos);

          // save location
          parsed.semantic.notProcedure.push(main.kids[i].pos);

          // replace
          main.kids.splice(i, 1, varToken);
        }
      }
    }
  }
}
