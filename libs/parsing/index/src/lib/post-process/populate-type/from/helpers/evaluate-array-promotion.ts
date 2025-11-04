import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { CallFunctionMethodToken, CallFunctionToken } from '@idl/tokenizer';
import { IDL_TYPE_LOOKUP, IDLDataType } from '@idl/types/idl-data-types';
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

  // get the type args
  const args = IDLTypeHelper.getAllTypeArgs(promoted);

  /**
   * Check if we have an array
   *
   * If so, even if another value may be "any", we should have an
   * array type back from IDL, so this takes precedence
   */
  for (let i = 0; i < types.length; i++) {
    if (IDLTypeHelper.isType(types[i], IDL_TYPE_LOOKUP.ARRAY)) {
      return IDLTypeHelper.createIDLType([
        {
          name: IDL_TYPE_LOOKUP.ARRAY,
          args: [args],
        },
      ]);
    }
  }

  /**
   * If we did not have an array, but we have "any", then return
   * all permutations of scalar and array of the scalar types
   */
  for (let i = 0; i < types.length; i++) {
    if (IDLTypeHelper.isAnyType(types[i])) {
      return args.concat(
        IDLTypeHelper.createIDLType([
          {
            name: IDL_TYPE_LOOKUP.ARRAY,
            args: [args],
          },
        ])
      );
    }
  }

  /**
   * If we get here, then we just return the arguments because
   * we don't have an array or "any"
   */
  return args;
}
