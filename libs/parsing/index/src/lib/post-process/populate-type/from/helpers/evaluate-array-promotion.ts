import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLTypeHelper,
  ParseIDLType,
  SerializeIDLType,
} from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
} from '@idl/parsing/tokenizer';

import { IDLIndex } from '../../../../idl-index.class';
import { GetArgTypes } from '../../../tree-handlers/helpers/get-arg-types';

/**
 * Processes the array promotion type and returns based on our arguments
 */
export function EvaluateArrayPromotion(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken | CallFunctionMethodToken>,
  promoted: IDLDataType
): IDLDataType {
  // get the types from our arguments
  const types = GetArgTypes(index, parsed, token);

  // get the type args
  const args = IDLTypeHelper.getAllTypeArgs(promoted);

  // check each type for an array
  for (let i = 0; i < types.length; i++) {
    if (IDLTypeHelper.isType(types[i], IDL_TYPE_LOOKUP.ARRAY)) {
      return ParseIDLType(`Array<${SerializeIDLType(args)}>`);
    }
  }

  // if we dont definitively have an array, and we have "any" types, then return either
  for (let i = 0; i < types.length; i++) {
    if (IDLTypeHelper.isAnyType(types[i])) {
      return args.concat(ParseIDLType(`Array<${SerializeIDLType(args)}>`));
    }
  }

  // no definitive array, so return normal type
  return args;
}
