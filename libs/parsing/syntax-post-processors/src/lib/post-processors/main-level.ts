import {
  BRANCH_TYPES,
  IBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
} from '@idl/parsing/syntax-tree';
import { MainLevelToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

/**
 * Tokens that indicate we end our main level program
 */
const STARTERS: { [key: string]: boolean } = {};
STARTERS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
STARTERS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;

/**
 * Track tokens to ignore (if only these are present then thats OK)
 */
const IGNORE: { [key: string]: boolean } = {};
IGNORE[TOKEN_NAMES.COMMENT] = true;
IGNORE[TOKEN_NAMES.COMMENT_BLOCK] = true;

/**
 * Convert main level program to a custom token with children
 */
IDL_SYNTAX_TREE_POST_PROCESSOR.onTree((tree, parsed) => {
  /** Extract text from our parsed content */
  const text = parsed.text;

  // skip empty code
  if (text.length === 0) {
    return;
  }

  // get number of
  const n = tree.length;

  // init flag that we have tokens which make up a main level program
  let flag = false;

  // process all trees
  let i: number;
  let j: number;
  for (j = 0; j < tree.length; j++) {
    // reverse search
    i = n - j - 1;

    // check if we need to stop
    if (tree[i].name in STARTERS) {
      j--;
      i++;
      break;
    } else {
      // check if token we can use to make a main level program
      if (!(tree[i].name in IGNORE)) {
        flag = true;
      }
    }
  }

  // check if we have a main level program
  if (j > 0 && flag) {
    // extract our children
    const mainChildren = tree.splice(i, tree.length - i);

    // make our new token and save
    const newToken: IBranch<MainLevelToken> = {
      type: BRANCH_TYPES.BRANCH,
      name: TOKEN_NAMES.MAIN_LEVEL,
      pos: copy(mainChildren[0].pos),
      idx: i,
      match: [],
      scope: [],
      parseProblems: [],
      end: undefined,
      kids: mainChildren,
    };
    tree.push(newToken);

    // search through our tokens and find the first end statement
    for (let z = 0; z < mainChildren.length; z++) {
      if (mainChildren[z].name === TOKEN_NAMES.MAIN_LEVEL_END) {
        newToken.end = {
          match: copy(mainChildren[z].match),
          pos: copy(mainChildren[z].pos),
        };

        // delete the rest - errors will be caught already when creating the tree
        const after = mainChildren.splice(z, mainChildren.length - z);
        if (after.length > 1) {
          for (let zz = 1; zz < after.length; zz++) {
            tree.push(after[zz]);
          }
        }
        break;
      }
    }
  }
});
