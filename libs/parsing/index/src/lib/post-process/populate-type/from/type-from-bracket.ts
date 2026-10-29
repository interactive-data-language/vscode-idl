import type { BracketToken } from '@idl/tokenizer';
import type { IDLDataType } from '@idl/types/idl-data-types';
import type { IParsed, TreeToken } from '@idl/types/syntax-tree';
import { copy } from 'fast-copy';

import type { IDLIndex } from '../../../idl-index.class';
import { TypeFromArrayCreation } from './type-from-array-creation';
import { TypeFromIndexing } from './type-from-indexing';

/**
 * Attempts to determine the type from system variables
 */
export function TypeFromBracket(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<BracketToken>,
): IDLDataType {
  // check if we are accessing a value or defining an array
  if (token.accessTokens.length > 0) {
    return copy(TypeFromIndexing(index, parsed, token));
  } else {
    return copy(TypeFromArrayCreation(index, parsed, token));
  }
}
