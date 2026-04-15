import {
  KeywordBinaryToken,
  KeywordDefinitionToken,
  KeywordToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';
import { TreeToken } from '@idl/types/syntax-tree';

/**
 * Gets the display name for a keyword since we have two kinds and
 * two cases.
 */
export function GetKeywordDisplayName(
  token: TreeToken<KeywordBinaryToken | KeywordDefinitionToken | KeywordToken>,
) {
  return token.name === TOKEN_NAMES.KEYWORD_BINARY
    ? token.match[1]
    : token.match[0];
}
