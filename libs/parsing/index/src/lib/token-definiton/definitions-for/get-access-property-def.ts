import { IBaseIndexedToken } from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { AccessPropertyToken } from '@idl/parsing/tokenizer';

import { GetProperty } from '../../helpers/get-property';
import { IDLIndex } from '../../idl-index.class';
import { CACHE_FOR_TOKEN_DEF } from '../get-token-definition';

/**
 * Returns property information for
 */
export function GetAccessPropertyDef(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken>
): IBaseIndexedToken {
  return GetProperty(index, parsed, token, CACHE_FOR_TOKEN_DEF);
}
