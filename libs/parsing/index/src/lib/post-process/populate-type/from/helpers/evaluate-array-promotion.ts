import { IDLTypeEvaluator } from '@idl/parsing/type-parser';
import { CallFunctionMethodToken, CallFunctionToken } from '@idl/tokenizer';
import { IDLDataType } from '@idl/types/idl-data-types';
import { IParsed, TreeToken } from '@idl/types/syntax-tree';

import { IDLIndex } from '../../../../idl-index.class';
import { GetArgTypes } from '../../../tree-handlers/helpers/get-arg-types';

/**
 * Processes the array promotion type and returns based on our arguments
 */
export function EvaluateArrayPromotion(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionMethodToken | CallFunctionToken>,
  promoted: IDLDataType
): IDLDataType {
  // get the types from our arguments
  const types = GetArgTypes(index, parsed, token);

  // return array promotion
  return IDLTypeEvaluator.arrayPromotion(promoted, types);
}
