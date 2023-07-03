import {
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLTypeHelper,
  IGlobalIndexedToken,
} from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
} from '@idl/parsing/tokenizer';

import { IDLIndex } from '../../../../idl-index.class';
import { EvaluateArrayPromotion } from './evaluate-array-promotion';
import { EvaluateTypeOfArgs } from './evaluate-type-of-args';

/**
 * Given a token determines our return type
 */
export function EvaluateReturnType(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken | CallFunctionMethodToken>,
  global: IGlobalIndexedToken<GlobalFunctionToken | GlobalFunctionMethodToken>
): IDLDataType {
  /**
   * Check for the `TypeOfArg<ArgIdx>` type
   */
  const argType = IDLTypeHelper.getMatchingTypes(
    global.meta.returns,
    IDL_TYPE_LOOKUP.TYPE_OF_ARG
  );
  if (argType.length > 0) {
    return EvaluateTypeOfArgs(index, parsed, token, argType);
  }

  /**
   * Check for the array promotion type that returns an array if any
   * argument is an array
   */
  const promoted = IDLTypeHelper.getMatchingTypes(
    global.meta.returns,
    IDL_TYPE_LOOKUP.ARRAY_PROMOTION
  );
  if (promoted.length > 0) {
    return EvaluateArrayPromotion(index, parsed, token, promoted);
  }

  /**
   * By default, return the type we have as "returns"
   */
  return global.meta.returns;
}
