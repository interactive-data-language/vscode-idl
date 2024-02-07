import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from './parsed.interface';
import { TreeRecurser } from './recursion-and-callbacks/tree-recurser';

/**
 * Populates the scope property for all tokens. Overwrites any values
 * present and this step is executed shortly before the syntax tree
 * is actually returned
 */
export function PopulateScope(
  parsed: IParsed,
  cancel: CancellationToken
): void {
  TreeRecurser(parsed, cancel, {
    onBasicToken: (token, current) => {
      token.scope = current.scope.slice(0);
    },
    onBranchToken: (token, current) => {
      token.scope = current.scope.slice(0);
    },
  });
}
