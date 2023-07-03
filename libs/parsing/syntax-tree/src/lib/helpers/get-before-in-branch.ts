import { TokenName } from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';

/**
 * Get the token before ours in the current branch
 *
 */
export function GetBeforeInBranch(
  token: TreeToken<TokenName>
): TreeToken<TokenName> | undefined {
  // return if already first
  if (token.idx === 0) {
    return undefined;
  }

  // get parent tokens
  const length = token?.scopeTokens?.length || 0;

  // make sure we have scope tokens to track
  if (length === 0) {
    return undefined;
  }

  return token.scopeTokens[length - 1].kids[token.idx - 1];
}
