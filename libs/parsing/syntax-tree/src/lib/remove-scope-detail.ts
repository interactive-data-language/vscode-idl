import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './parsed.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';

/**
 * Removes scope detail from our object to force our tree to no
 * longer be circular.
 */
export function RemoveScopeDetail(
  parsed: IParsed,
  cancel: CancellationToken,
  force = false
): void {
  if (parsed.hasDetail || force) {
    TreeRecurserBasic(parsed.tree, cancel, {
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
