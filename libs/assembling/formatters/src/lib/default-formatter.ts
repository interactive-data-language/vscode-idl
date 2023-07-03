import { TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

/**
 * Default formatter to apply to a token.
 *
 * Replaces/sets the first match to a string that will be used for formatting
 */
export function DefaultFormatter(token: TreeToken<TokenName>) {
  if (token.match.length === 0) {
    token.match.push('');
  } else {
    token.match[0] === token.match[0].trim();
  }
}
