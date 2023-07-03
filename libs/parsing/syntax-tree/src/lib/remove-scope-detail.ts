import { IParsed } from './build-tree.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';

/**
 * Removes scope detail from our object to force our tree to no
 * longer be circular.
 */
export function RemoveScopeDetail(parsed: IParsed): void {
  if (parsed.hasDetail) {
    TreeRecurserBasic(parsed.tree, {
      onBasicToken: (token) => {
        delete token.scopeTokens;
        delete token.accessTokens;
      },
      onBranchToken: (token) => {
        delete token.scopeTokens;
        delete token.accessTokens;
      },
    });

    parsed.hasDetail = false;
  }
}
