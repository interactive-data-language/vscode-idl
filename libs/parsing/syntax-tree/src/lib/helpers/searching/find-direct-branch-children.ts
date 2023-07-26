import { NonBasicTokenNames, TokenName } from '@idl/parsing/tokenizer';

import { IBranch, TreeToken } from '../../branches.interface';

/**
 * Find direct children of a branch
 */
export function FindDirectBranchChildren<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  token: T
) {
  // init result for recursing
  const found: TreeToken<T>[] = [];

  // process all children
  for (let i = 0; i < (branch.kids || []).length; i++) {
    // save our token
    if (branch.kids[i].name === token) {
      found.push(branch.kids[i] as TreeToken<T>);
    }
  }

  // return what we found!
  return found;
}
