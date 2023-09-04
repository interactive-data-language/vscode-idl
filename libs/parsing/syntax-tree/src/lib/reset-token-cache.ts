import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './build-syntax-tree.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';

/**
 * Resets token cache to clear anything that was previously set so that
 * we can re-validate our tokens
 */
export function ResetTokenCache(
  parsed: IParsed,
  cancel: CancellationToken
): void {
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
