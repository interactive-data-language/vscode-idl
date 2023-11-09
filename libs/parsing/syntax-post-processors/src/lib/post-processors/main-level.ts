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

  // reverse tree
  tree.reverse();

  // did we find a token that we can make a main level program from?
  let found = false;

  // index of our element
  let idx: number;
  for (let i = 0; i < tree.length; i++) {
    if (!(tree[i].name in IGNORE)) {
      found = true;
    }
    if (tree[i].name in STARTERS) {
      // if first, no main level
      if (i === 0) {
        tree.reverse();
        return;
      }
      idx = i - 1;
      break;
    }
    if (i === tree.length - 1 && found) {
      idx = tree.length - 1;
      break;
    }
  }

  // revert order
  tree.reverse();

  // return if no match
  if (idx === undefined) {
    return;
  }

  // change end of the tree to account for reverse
  idx = tree.length - idx - 1;

  // return if only tokens that we should ignore
  if (tree.slice(idx).filter((el) => !(el.name in IGNORE)).length === 0) {
    return;
  }

  // extract our children
  const mainChildren = tree.splice(idx, tree.length - idx);

  // make our new token and save
  const newToken: IBranch<MainLevelToken> = {
    type: BRANCH_TYPES.BRANCH,
    name: TOKEN_NAMES.MAIN_LEVEL,
    pos: copy(mainChildren[0].pos),
    idx: idx,
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
});
