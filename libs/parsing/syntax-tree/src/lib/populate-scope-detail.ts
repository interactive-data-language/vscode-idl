import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './parsed.interface';
import { TreeRecurser } from './recursion-and-callbacks/tree-recurser';

/**
 * Populates scope detail information giving us a circular tree with
 * our parent tokens and the tokens that are used for accessing which
 * come before and are used for types.
 *
 * Use `RemoveScopeDetail` to get rid of this information
 */
export function PopulateScopeDetail(
  parsed: IParsed,
  cancel: CancellationToken
): void {
  // only process if we dont have scope detail
  if (!parsed.hasDetail) {
    TreeRecurser(parsed, cancel, {
      onBasicToken: (token, current) => {
        token.scopeTokens = current.scopeTokens.slice();
        token.accessTokens = current.accessTokens.slice();
      },
      onBranchToken: (token, current) => {
        token.scopeTokens = current.scopeTokens.slice();
        token.accessTokens = current.accessTokens.slice();
      },
    });

    // save that we have detail
    parsed.hasDetail = true;
  }
}
