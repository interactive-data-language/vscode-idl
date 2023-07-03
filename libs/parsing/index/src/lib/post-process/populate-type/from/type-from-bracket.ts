import { IDLDataType } from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { BracketToken } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromArrayCreation } from './type-from-array-creation';
import { TypeFromIndexing } from './type-from-indexing';

/**
 * Attempts to determine the type from system variables
 */
export function TypeFromBracket(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<BracketToken>
): IDLDataType {
  // check if we are accessing a value or defining an array
  if (token.accessTokens.length > 0) {
    return copy(TypeFromIndexing(index, parsed, token));
  } else {
    return copy(TypeFromArrayCreation(index, parsed, token));
  }
}
