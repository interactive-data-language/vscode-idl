import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './parsed.interface';
import { TreeRecurser } from './recursion-and-callbacks/tree-recurser';
import { ResetTokenCache } from './reset-token-cache';

/**
 * Populates scope detail information giving us a circular tree with
 * our parent tokens and the tokens that are used for accessing which
 * come before and are used for types.
 *
 * Also resets the token cache in the same tree iterator to reduce the number
 * of times we need to process a tree
 *
 * Use `RemoveScopeDetail` to get rid of this information
 */
export function PopulateScopeDetailAndResetTokenCache(
  parsed: IParsed,
  cancel: CancellationToken
): void {
  switch (true) {
    case !parsed.hasDetail:
      TreeRecurser(parsed, cancel, {
        onBasicToken: (token, current) => {
          token.scopeTokens = current.scopeTokens.slice();
          token.accessTokens = current.accessTokens.slice();
          token.cache = {};
        },
        onBranchToken: (token, current) => {
          token.scopeTokens = current.scopeTokens.slice();
          token.accessTokens = current.accessTokens.slice();
          token.cache = {};
        },
      });
      parsed.hasCache = true;
      parsed.hasDetail = true;
      break;
    default:
      ResetTokenCache(parsed, cancel);
      break;
  }
}
