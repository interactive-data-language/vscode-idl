import {
  AccessPropertyToken,
  STRUCTURE_PROPERTY_CLEANER_REGEX,
  StructurePropertyToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';

/**
 * Gets the name of our property
 */
export function GetPropertyName(
  token: TreeToken<AccessPropertyToken | StructurePropertyToken>
) {
  return token.name === TOKEN_NAMES.ACCESS_PROPERTY
    ? token.match[0].substring(1)
    : token.match[0].replace(STRUCTURE_PROPERTY_CLEANER_REGEX, '');
}
