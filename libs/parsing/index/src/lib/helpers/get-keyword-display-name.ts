import { TreeToken } from '@idl/parsing/syntax-tree';
import {
  KeywordBinaryToken,
  KeywordDefinitionToken,
  KeywordToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Gets the display name for a keyword since we have two kinds and
 * two cases.
 */
export function GetKeywordDisplayName(
  token: TreeToken<KeywordToken | KeywordBinaryToken | KeywordDefinitionToken>
) {
  return token.name === TOKEN_NAMES.KEYWORD_BINARY
    ? token.match[1]
    : token.match[0];
}
