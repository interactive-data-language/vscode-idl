import { NonBasicTokenNames, TokenName } from '@idl/parsing/tokenizer';

import { IBranch } from '../../branches.interface';

/**
 * Checks if a specified token is in a branch
 */
export function IsChildInBranch<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  token: T
): boolean {
  for (let i = 0; i < branch.kids.length; i++) {
    if (branch.kids[i].name === token) {
      return true;
    }
  }
  return false;
}
