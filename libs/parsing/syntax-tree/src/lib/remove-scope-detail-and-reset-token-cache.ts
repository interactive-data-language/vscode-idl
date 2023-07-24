import { IParsed } from './build-tree.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';
import { ResetTokenCache } from './reset-token-cache';

/**
 * Removes scope detail and resets our token cache
 */
export function RemoveScopeDetailAndResetTokenCache(parsed: IParsed): void {
  switch (true) {
    case parsed.hasDetail:
      TreeRecurserBasic(parsed.tree, {
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
      break;
    default:
      ResetTokenCache(parsed);
      break;
  }
}
