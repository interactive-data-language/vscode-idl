import {
  CommentBlockToken,
  NonBasicTokenNames,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';

import { BRANCH_TYPES, IBranch, TreeToken } from '../../branches.interface';

/**
 * Recurser to find children and their docs
 */
function FindAllBranchChildrenAndTheirDocsRecurser<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  token: T,
  found: { token: TreeToken<T>; docs?: TreeToken<CommentBlockToken> }[]
) {
  // process all children
  for (let i = 0; i < (branch.kids || []).length; i++) {
    // save our token
    if (branch.kids[i].name === token) {
      // check for docs
      let docs: IBranch<CommentBlockToken> = undefined;
      if (i > 0) {
        if (branch.kids[i - 1].name === TOKEN_NAMES.COMMENT_BLOCK) {
          docs = branch.kids[i - 1] as IBranch<CommentBlockToken>;
        }
      }

      // save our token and docs
      found.push({ token: branch.kids[i] as TreeToken<T>, docs });
    }

    // recurse if needed
    if (branch.kids[i].type === BRANCH_TYPES.BRANCH) {
      FindAllBranchChildrenAndTheirDocsRecurser(
        branch.kids[i] as IBranch<NonBasicTokenNames>,
        token,
        found
      );
    }
  }
}

/**
 * Recursively find all matching children in a branch and, if the have docs before, return that
 */
export function FindAllBranchChildrenAndDocs<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  token: T
) {
  // init result for recursing
  const found: { token: TreeToken<T>; docs?: IBranch<CommentBlockToken> }[] =
    [];

  // look for kids
  FindAllBranchChildrenAndTheirDocsRecurser(branch, token, found);

  // return what we found!
  return found;
}
