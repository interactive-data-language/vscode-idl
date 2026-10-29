import type { AccessPropertyToken } from '@idl/tokenizer';
import type { IBaseIndexedToken } from '@idl/types/idl-data-types';
import type { IParsed, TreeToken } from '@idl/types/syntax-tree';

import { GetProperty } from '../../helpers/get-property';
import type { IDLIndex } from '../../idl-index.class';
import { CACHE_FOR_TOKEN_DEF } from '../get-token-definition';

/**
 * Returns property information for
 */
export function GetAccessPropertyDef(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken>,
): IBaseIndexedToken {
  return GetProperty(index, parsed, token, CACHE_FOR_TOKEN_DEF);
}
