import { TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';

/**
 * Returns the literal value for a token, as a string.
 *
 * Returns `undefined` if we don't have a value to get
 */
export function EvaluateToken(token: TreeToken<TokenName>): string {
  switch (token.name) {
    case TOKEN_NAMES.NUMBER:
      return token.match[0].trim();
    case TOKEN_NAMES.QUOTE_SINGLE:
      return token.match[1];
    case TOKEN_NAMES.QUOTE_DOUBLE:
      return token.match[1];
    case TOKEN_NAMES.STRING_TEMPLATE_LITERAL:
      if (token.kids.length === 1) {
        if (token.kids[0].name === TOKEN_NAMES.STRING_TEMPLATE_STRING) {
          return token.kids[0].match[0];
        }
      }
      break;
    default:
      break;
  }

  return undefined;
}
