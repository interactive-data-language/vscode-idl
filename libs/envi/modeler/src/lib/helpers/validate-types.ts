import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  IDL_HASH_TYPES,
  IDL_NUMBER_TYPE_ORDER,
  IDL_TYPE_LOOKUP,
  IDLDataType,
} from '@idl/types/idl-data-types';

/**
 * Validates the types that are connected
 */
export function ValidateTypes(
  fromName: string,
  fromFullType: IDLDataType,
  toName: string,
  toFullType: IDLDataType,
  fromErrs: string[],
) {
  const fromType = fromFullType[0];
  const toType = toFullType[0];

  // determine how to compare types
  switch (true) {
    /**
     * Check for array
     */
    case toType.name === IDL_TYPE_LOOKUP.ARRAY: {
      /**
       * Dont strictly check array to array since we work some magic here
       * with preprocessing before we create the model file itself
       */
      // if (!(fromType.name === IDL_TYPE_LOOKUP.ARRAY)) {
      //   fromErrs.push(
      //     `  "${fromName}" is not an array and cannot be connected to the parameter "${toName}"`,
      //   );
      //   return;
      // }

      /**
       * Extract the type for from arguments
       *
       * If we have an array, extract type args, otherwise just use the original type
       *
       * Always extract the toType type arguments
       */
      const fromArgs =
        fromType.name === IDL_TYPE_LOOKUP.ARRAY
          ? IDLTypeHelper.getAllTypeArgs(fromFullType)
          : fromFullType;
      const toArgs = IDLTypeHelper.getAllTypeArgs(toFullType);

      // validate the type arguments
      ValidateTypes(fromName, fromArgs, toName, toArgs, fromErrs);
      break;
    }

    /**
     * Is our array a number type
     */
    case toType.name in IDL_NUMBER_TYPE_ORDER:
      if (!(fromType.name in IDL_NUMBER_TYPE_ORDER)) {
        fromErrs.push(
          `  "${fromName}" is not a number type (ex: byte, int, long) and cannot be connected to the parameter "${toName}"`,
        );
      }
      break;

    /**
     * Is our array a hash type
     */
    case toType.name in IDL_HASH_TYPES:
      if (!(fromType.name in IDL_NUMBER_TYPE_ORDER)) {
        fromErrs.push(
          `  "${fromName}" is not a hash type (hash, orderedhash, dict) and cannot be connected to the parameter "${toName}"`,
        );
      }
      break;

    /**
     * Make sure types are teh same
     */
    default:
      if (toType.name !== fromType.name) {
        fromErrs.push(
          `  "${fromName}" does not have the same type as the connected parameter "${toName}" and cannot be connected`,
        );
      }
      break;
  }
}
