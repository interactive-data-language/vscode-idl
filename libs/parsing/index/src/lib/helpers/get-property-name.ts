import { TreeToken } from '@idl/parsing/syntax-tree';
import {
  AccessPropertyToken,
  StructurePropertyToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Gets the name of our property
 */
export function GetPropertyName(
  token: TreeToken<AccessPropertyToken | StructurePropertyToken>
) {
  return token.name === TOKEN_NAMES.ACCESS_PROPERTY
    ? token.match[0].substring(1)
    : token.match[1];
}
