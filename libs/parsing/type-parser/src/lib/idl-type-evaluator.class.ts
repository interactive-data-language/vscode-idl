import {
  IDL_ANY_TYPE,
  IDL_TYPE_LOOKUP,
  IDLDataType,
} from '@idl/types/idl-data-types';

import { IDLTypeHelper } from './idl-type-helper.class';

/**
 * Simple helper that tells us if a number is a number
 */
function IsNumber(name: string) {
  return (
    !isNaN(name as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(name))
  );
}

/**
 * Class with static methods to evaluate types from parsing
 *
 * This is so core logic for evaluating types is to be exoressed in a re-usable
 * way that can be accessed across the code base, not just within
 * our parsing and type-from functions
 */
export class IDLTypeEvaluator {
  /**
   * Handles array promotion
   */
  static arrayPromotion(promotionType: IDLDataType, checkTypes: IDLDataType[]) {
    // get the type args from our promotion type - tells us how to type the array
    const args = IDLTypeHelper.getAllTypeArgs(promotionType);

    /**
     * Check if we have an array
     *
     * If so, even if another value may be "any", we should have an
     * array type back from IDL, so this takes precedence
     */
    for (let i = 0; i < checkTypes.length; i++) {
      if (IDLTypeHelper.isType(checkTypes[i], IDL_TYPE_LOOKUP.ARRAY)) {
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
    for (let i = 0; i < checkTypes.length; i++) {
      if (IDLTypeHelper.isAnyType(checkTypes[i])) {
        return args.concat(
          IDLTypeHelper.createIDLType([
            {
              name: IDL_TYPE_LOOKUP.ARRAY,
              args: [args],
            },
          ]),
        );
      }
    }

    /**
     * If we get here, then we just return the arguments because
     * we don't have an array or "any"
     */
    return args;
  }

  /**
   * Return the type for a "TypeOfArgs<0>" type
   */
  static typeOfArgs(typeOfArgType: IDLDataType, argTypes: IDLDataType[]) {
    /**
     * Get the argument index
     *
     * Use the serialized property because this should be our number
     * as a string.
     *
     * The "name" property doesn't work here any more because the type
     * will not be "Number" and will instead be something like "Int"
     * because of our smart IDL type processing.
     */
    const iArg = typeOfArgType[0].args[0][0].serialized;

    /**
     * If we dont have a number, return "any" because we cant process this
     */
    if (!IsNumber(iArg)) {
      return IDL_ANY_TYPE;
    }

    // get the arg index
    const aIdx = +iArg;
    if (aIdx > argTypes.length - 1) {
      return IDL_ANY_TYPE;
    }

    return argTypes[iArg];
  }
}
