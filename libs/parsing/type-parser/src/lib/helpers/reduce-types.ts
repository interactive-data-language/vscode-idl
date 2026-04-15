import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  KNOWN_IDL_TYPE_ARG_PROMOTIONS,
  TYPE_ORDER_LOOKUP,
} from '@idl/types/idl-data-types';

import { MergeTypeArgs } from './merge-type-args';

/**
 * Takes an IDL data type and reduces it to remove any duplicate types
 *
 * If we encounter literal values, then we will perform basic type promotion
 * among number types that are present
 */
export function ReduceIDLDataType(type: IDLDataType): IDLDataType {
  /** Track our reduced data type */
  const reduced: IDLDataType = [];

  // track what we have found
  const found: { [key: string]: IDLDataTypeBase<string> } = {};

  /** Track name of the highest type */
  let highestName: string;

  /** Track type order of highest type */
  let highestNumber: number;

  /** Track if we had the explicit number type */
  let wasNumber = false;

  /** Track if we found literal values */
  let foundLiterals = false;

  // process each type
  for (let i = 0; i < type.length; i++) {
    // bail if any type
    if (type[i].name === IDL_TYPE_LOOKUP.ANY) {
      return [type[i]];
    }

    // track if we have literal values
    foundLiterals = foundLiterals || Array.isArray(type[i].value);

    /**
     * TODO: Update this logic for complex number generic type
     * promotion as well, but that is likely a big edge case
     */

    // check if we are in our type order lookup
    if (
      type[i].name === IDL_TYPE_LOOKUP.NUMBER ||
      (foundLiterals && type[i].name in TYPE_ORDER_LOOKUP)
    ) {
      // check if we have already found an item
      if (highestName) {
        // if we are not the highest type, then replace the name of this item
        if (highestNumber < TYPE_ORDER_LOOKUP[type[i].name]) {
          // if we were a number and have higher type, make
          // complex number
          if (wasNumber) {
            type[i].name = IDL_TYPE_LOOKUP.COMPLEX_NUMBER;
          }

          /** Get existing highest item */
          const old = found[highestName];

          // update constants
          highestNumber = TYPE_ORDER_LOOKUP[type[i].name];
          highestName = type[i].name;

          // replace old props and save with new name
          old.name = highestName;
          found[highestName] = old;
        } else {
          // if not highest type, simply set to the new name
          type[i].name = highestName;
        }
      } else {
        // save highest type information
        highestName = type[i].name;
        highestNumber = TYPE_ORDER_LOOKUP[type[i].name];
      }
    }

    // save if we encountered a number
    wasNumber = wasNumber || type[i].name === IDL_TYPE_LOOKUP.NUMBER;

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
            ...type[i].value,
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
   * Dont recurse here into type arguments
   *
   * This routine should be called in "PostProcessIDLType" which recurses into
   * arguments, so only process type level
   */
  // // reduce type arguments
  // for (let i = 0; i < reduced.length; i++) {
  //   for (let j = 0; j < reduced[i].args.length; j++) {
  //     reduced[i].args[j] = ReduceIDLDataType(reduced[i].args[j]);
  //   }
  // }

  /**
   * Make sure literal types are unique
   */
  for (let i = 0; i < reduced.length; i++) {
    if (Array.isArray(reduced[i].value)) {
      reduced[i].value = [...new Set(reduced[i].value)];
    }
  }

  return reduced;
}
