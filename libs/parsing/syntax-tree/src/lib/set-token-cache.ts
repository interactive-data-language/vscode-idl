import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './parsed.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';

/**
 * Set the cache to make sure it is present
 */
export function SetTokenCache(
  parsed: IParsed,
  cancel: CancellationToken
): void {
  if (!parsed.hasCache) {
    TreeRecurserBasic(parsed.tree, cancel, {
      onBasicToken: (token) => {
        token.cache = {};
      },
      onBranchToken: (token) => {
        token.cache = {};
      },
    });
    parsed.hasCache = true;
  }
}
