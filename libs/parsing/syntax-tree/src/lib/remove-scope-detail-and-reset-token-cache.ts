import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './parsed.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';

/**
 * Removes scope detail and resets our token cache
 */
export function RemoveScopeDetailAndResetTokenCache(
  parsed: IParsed,
  cancel: CancellationToken
): void {
  TreeRecurserBasic(parsed.tree, cancel, {
    onBasicToken: (token) => {
      delete token.scopeTokens;
      delete token.accessTokens;
      token.cache = {};
    },
    onBranchToken: (token) => {
      delete token.scopeTokens;
      delete token.accessTokens;
      token.cache = {};
    },
  });
  parsed.hasCache = false;
  parsed.hasDetail = false;
}
