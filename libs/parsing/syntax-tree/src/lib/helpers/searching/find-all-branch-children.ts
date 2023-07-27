import { NonBasicTokenNames, TokenName } from '@idl/parsing/tokenizer';

import { BRANCH_TYPES, IBranch, TreeToken } from '../../branches.interface';

/**
 * Recurser to find children
 */
function FindAllBranchChildrenRecurser<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  findThese: { [key: string]: any },
  found: TreeToken<T>[],
  skipThese: { [key: string]: any } = {}
) {
  // process all children
  for (let i = 0; i < (branch.kids || []).length; i++) {
    // save our token
    if (branch.kids[i].name in findThese) {
      found.push(branch.kids[i] as TreeToken<T>);
    }

    // recurse if needed
    if (
      branch.kids[i].type === BRANCH_TYPES.BRANCH &&
      !(branch.name in skipThese)
    ) {
      FindAllBranchChildrenRecurser(
        branch.kids[i] as IBranch<NonBasicTokenNames>,
        findThese,
        found,
        skipThese
      );
    }
  }
}

/**
 * Recursively find all matching children in a branch
 */
export function FindAllBranchChildren<T extends TokenName>(
  branch: IBranch<NonBasicTokenNames>,
  token: T | T[],
  skipThese: { [key: string]: any } = {}
): TreeToken<T>[] {
  // init result for recursing
  const found: TreeToken<T>[] = [];

  // unpack tokens to track
  const findThese: { [key: string]: any } = {};
  const add = !Array.isArray(token) ? [token] : token;
  for (let i = 0; i < add.length; i++) {
    findThese[add[i]] = undefined;
  }

  // look for kids
  FindAllBranchChildrenRecurser(branch, findThese, found, skipThese);

  // return what we found!
  return found;
}
