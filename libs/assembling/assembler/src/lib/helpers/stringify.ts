import { TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';

import {
  ALWAYS_SPACE_AFTER,
  ALWAYS_SPACE_BEFORE,
  FORCED_SPACES_AROUND,
  NEVER_SPACE_AFTER,
  PRESERVE_SPACES,
} from './merge-rules.interface';

/**
 * Helper function to add more complex logic to determine if we need
 * to add a space when formatting tokens
 */
function ShouldAddSpace(
  token: TreeToken<TokenName>,
  previousToken: TreeToken<TokenName> | undefined
): boolean {
  // override rules
  if (
    token.name in FORCED_SPACES_AROUND ||
    previousToken?.name in FORCED_SPACES_AROUND
  ) {
    return true;
  }

  // check if we have a previous token to check
  if (previousToken !== undefined) {
    switch (true) {
      // tokens that we should never have spaces after
      case previousToken.name in NEVER_SPACE_AFTER:
        return false;
      // check if we have a logical negation operator before
      case previousToken.name === TOKEN_NAMES.OPERATOR:
        if (previousToken.match[0] === '~') {
          return false;
        }
        break;
      default:
        break;
    }
  }

  // default case that we use
  return (
    token.name in ALWAYS_SPACE_BEFORE ||
    previousToken?.name in ALWAYS_SPACE_AFTER
  );
}

/**
 * Converts a token to a string
 */
export function Stringify(
  token: TreeToken<TokenName>,
  previousToken: TreeToken<TokenName> | undefined,
  first = false
) {
  return StringifyString(token, token.match[0] || '', previousToken, first);
}

/**
 * Converts a string for consistent formatting
 */
export function StringifyString(
  token: TreeToken<TokenName>,
  str: string,
  previousToken: TreeToken<TokenName> | undefined,
  first = false
) {
  // get string to append
  const before = ShouldAddSpace(token, previousToken) && !first ? ' ' : '';

  // return the first match - nothing fancy for formatting just yet
  if (token.name in PRESERVE_SPACES) {
    return `${before}${str}`;
  } else {
    return `${before}${str.trim()}`;
  }
}
