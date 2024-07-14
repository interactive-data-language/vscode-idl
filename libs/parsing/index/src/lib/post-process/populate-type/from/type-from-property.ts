import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { AccessPropertyToken } from '@idl/parsing/tokenizer';
import { IDL_ANY_TYPE, IDLDataType } from '@idl/types/core';
import copy from 'fast-copy';

import { GetProperty } from '../../../helpers/get-property';
import { IDLIndex } from '../../../idl-index.class';

/**
 * Attempts to determine the type from system variables
 */
export function TypeFromProperty(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken>
): IDLDataType {
  // find matching property
  const property = GetProperty(index, parsed, token);

  // return the type of our property
  if (property !== undefined) {
    return copy(property.type);
  } else {
    return copy(IDL_ANY_TYPE);
  }
}
