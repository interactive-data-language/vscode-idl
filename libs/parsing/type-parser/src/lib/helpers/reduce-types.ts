import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  KNOWN_IDL_TYPE_ARG_PROMOTIONS,
} from '@idl/types/idl-data-types';

import { MergeTypeArgs } from './merge-type-args';

/**
 * Takes an IDL data type and reduces it to remove any duplicate types
 */
export function ReduceIDLDataType(type: IDLDataType): IDLDataType {
  /** Track our decuded data type */
  const reduced: IDLDataType = [];

  // track what we have found
  const found: { [key: string]: IDLDataTypeBase<string> } = {};

  // process each type
  for (let i = 0; i < type.length; i++) {
    // bail if any type
    if (type[i].name === IDL_TYPE_LOOKUP.ANY) {
      return [type[i]];
    }

    /**
     * If we have a type that has arguments, dont reduce
     *
     * Reduction is primarily for scalar types like numbers or strings
     */
    if (
      type[i].args.length > 0 &&
      !(type[i].name in KNOWN_IDL_TYPE_ARG_PROMOTIONS)
    ) {
      reduced.push(type[i]);
      continue;
    }

    // check if we have a new type to track
    if (!(type[i].name in found)) {
      found[type[i].name] = type[i];
      reduced.push(type[i]);
    } else {
      // merge type arguments if needed
      if (type[i].name in KNOWN_IDL_TYPE_ARG_PROMOTIONS) {
        MergeTypeArgs(found[type[i].name].args, type[i].args);
      }

      /**
       * If existing, see if we have literal values that we need to merge
       */
      if (Array.isArray(found[type[i].name].value)) {
        // existing array, so concat
        if (Array.isArray(type[i].value)) {
          found[type[i].name].value = found[type[i].name].value.concat(
            ...type[i].value
          );
        } else {
          // if only one has a value, then remove tracked values
          // because we should make it generic
          delete found[type[i].name].value;
        }
      }
    }
  }

  /**
   * Dont recurse here
   *
   * This wourinte should be called in "PostProcessIDLType" which recurses into
   * arguments
   */
  // // reduce type arguments
  // for (let i = 0; i < reduced.length; i++) {
  //   for (let j = 0; j < reduced[i].args.length; j++) {
  //     reduced[i].args[j] = ReduceIDLDataType(reduced[i].args[j]);
  //   }
  // }

  return reduced;
}
