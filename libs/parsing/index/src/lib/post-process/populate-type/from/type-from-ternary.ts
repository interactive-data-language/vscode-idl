import { IDL_ANY_TYPE, IDLDataType, IDLTypeHelper } from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { LogicalTernaryThenToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromTokens } from './type-from-tokens';

/**
 * Attempts to determine the type from ternary operators
 */
export function TypeFromTernary(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<LogicalTernaryThenToken>
): IDLDataType {
  // if no children return
  if (token.kids.length === 0) {
    return copy(IDL_ANY_TYPE);
  }

  // get the kids
  const kids = token.kids;
  const last = kids[kids.length - 1];

  // check for syntax error
  if (last.name !== TOKEN_NAMES.LOGICAL_TERNARY_ELSE) {
    return copy(IDL_ANY_TYPE);
  }

  /**
   * track output type
   */
  const outputType: IDLDataType = TypeFromTokens(
    index,
    parsed,
    kids.slice(0, -1)
  ).concat(TypeFromTokens(index, parsed, last.kids));

  if (IDLTypeHelper.isAnyType(outputType)) {
    return copy(IDL_ANY_TYPE);
  } else {
    return copy(IDLTypeHelper.reduceIDLDataType(outputType));
  }
}
