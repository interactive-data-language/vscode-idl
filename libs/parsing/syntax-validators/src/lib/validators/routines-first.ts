import {
  BRANCH_TYPES,
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Track token names that trigger this happening from the reverse search.
 *
 * Also indicates the only allowed tokens types before a procedure or function
 * definition.
 */
const STARTERS: { [key: string]: boolean } = {};
STARTERS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
STARTERS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;

/**
 * Track tokens to ignore (things that are allowed)
 */
const IGNORE: { [key: string]: boolean } = {};
IGNORE[TOKEN_NAMES.COMMENT] = true;
IGNORE[TOKEN_NAMES.COMMENT_BLOCK] = true;
IGNORE[TOKEN_NAMES.INCLUDE] = true;

/**
 * Make sure that, once we encounter a routine definition, there are only routine
 * definitions up above.
 */
IDL_SYNTAX_TREE_VALIDATOR.onTree((tree, parsed) => {
  // get number of
  const n = tree.length;

  // flag if we need to filter tokens or not
  let filter = false;

  // process all trees
  let i: number;
  for (let j = 0; j < tree.length; j++) {
    // reverse search
    i = n - j - 1;

    // check if we havent found a filter routine yet
    if (!filter) {
      if (tree[i].name in STARTERS) {
        filter = true;
      }
    } else {
      if (!(tree[i].name in STARTERS) && !(tree[i].name in IGNORE)) {
        // init end position
        let end = tree[i].pos;

        // check if we have a better end
        if (tree[i].type === BRANCH_TYPES.BRANCH) {
          end = (tree[i] as IBranch<NonBasicTokenNames>).end
            ? (tree[i] as IBranch<NonBasicTokenNames>).end.pos
            : tree[i].pos;
        }

        // save problem
        tree[i].parseProblems.push(IDL_PROBLEM_CODES.ROUTINES_FIRST);
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.ROUTINES_FIRST,
            tree[i].pos,
            end
          )
        );
      }
    }
  }
});
