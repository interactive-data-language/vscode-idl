import { IDL_ANY_TYPE, IDLDataType } from '@idl/data-types/core';
import { IParsed, SyntaxTree } from '@idl/parsing/syntax-tree';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromMultipleTokens } from './type-from-multiple-tokens';
import { TypeFromSingleToken } from './type-from-single-token';

/**
 * Attempts to determine the type when we have assignment
 */
export function TypeFromTokens(
  index: IDLIndex,
  parsed: IParsed,
  tree: SyntaxTree
): IDLDataType {
  // get the number of children
  const length = tree.length;

  // determine how to proceed
  switch (true) {
    // what do we have to our right
    case length === 1:
      return TypeFromSingleToken(index, parsed, tree[0]);
    case length > 0:
      return TypeFromMultipleTokens(index, parsed, tree);
    default:
      break;
  }

  // default return value
  return copy(IDL_ANY_TYPE);
}
