import { TokenName } from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';

/**
 * Get the next element in a tree. Returns undefined if there is no other
 * element in our current branch
 *
 * Does not work at the top-level (i.e. where routines are defined)
 */
export function GetNextInBranch(
  token: TreeToken<TokenName>
): TreeToken<TokenName> | undefined {
  const length = token?.scopeTokens?.length || 0;

  // make sure we have scope tokens to track
  if (length === 0) {
    return undefined;
  }

  return token.scopeTokens[length - 1].kids[token.idx + 1];
}
