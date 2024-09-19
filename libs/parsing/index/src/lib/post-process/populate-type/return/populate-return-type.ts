import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/parsing/syntax-tree';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  IDLTypeHelper,
  IGlobalIndexedToken,
} from '@idl/types/core';

import { IDLIndex } from '../../../idl-index.class';

/**
 * What global tokens do we try and get return types for
 */
const RETURN_TYPES_FOR: { [key: string]: undefined } = {};
RETURN_TYPES_FOR[GLOBAL_TOKEN_TYPES.FUNCTION] = undefined;
RETURN_TYPES_FOR[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD] = undefined;

/**
 * Populates the return type for functions
 */
export function PopulateReturnType(
  index: IDLIndex,
  parsed: IParsed,
  cancel: CancellationToken
) {
  /**
   * Find functions to process
   */
  const functions = (
    parsed.global.filter(
      (global) =>
        global.type in RETURN_TYPES_FOR && !global.name.endsWith('::init')
    ) as IGlobalIndexedToken<GlobalFunctionToken | GlobalFunctionMethodToken>[]
  ).filter((global) => !IDLTypeHelper.isAnyType(global.meta.returns));

  /**
   * Do nothing if we have no matches
   */
  if (functions.length === 0) {
    return;
  }
}
