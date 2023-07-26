import { NonBasicTokenNames, TokenName } from '@idl/parsing/tokenizer';

import { IBranch, TreeToken } from '../../branches.interface';

/**
 * Checks the children of a branch for a token and returns the
 * first match that is found
 */
export function FindFirstBranchChild<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  token: T
): TreeToken<T> | undefined {
  for (let i = 0; i < (branch.kids || []).length; i++) {
    if (branch.kids[i].name === token) {
      return branch.kids[i] as TreeToken<T>;
    }
  }
  return undefined;
}
