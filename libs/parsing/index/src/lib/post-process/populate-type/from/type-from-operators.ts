import { IParsed, ISplitTreeOnOperators } from '@idl/parsing/syntax-tree';
import {
  IDL_ANY_TYPE,
  IDL_BOOLEAN_TYPE,
  IDLDataType,
  IDLTypeHelper,
  ParseIDLType,
} from '@idl/types/core';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromOperatorSplit } from './type-from-operator-split';
import { TypePromotion } from './type-promotion';

/**
 * Operators that always return a boolean value
 */
const BOOLEAN_OPERATORS: { [key: string]: any } = {};
BOOLEAN_OPERATORS['&&'] = true;
BOOLEAN_OPERATORS['||'] = true;

/**
 * Operators that create an iterable of boolean values
 */
const LOGICAL_OPERATOR: { [key: string]: any } = {
  not: true,
  eq: true,
  ne: true,
  le: true,
  lt: true,
  ge: true,
  gt: true,
  and: true,
  or: true,
  xor: true,
};

/**
 * Types from logical operations
 */
const LOGICAL_OUTPUT_TYPES = {
  LIST: ParseIDLType('List<Boolean>'),
  HASH: ParseIDLType('List<String>'),
  ORDEREDHASH: ParseIDLType('List<String>'),
  ARRAY: ParseIDLType('Array<Boolean>'),
  DICTIONARY: ParseIDLType('String | Array<String>'),
};

/**
 * Check for type on left/right of operation
 */
function TypeCheck(left: IDLDataType, right: IDLDataType, reference: string) {
  return (
    IDLTypeHelper.isType(left, reference) ||
    IDLTypeHelper.isType(right, reference)
  );
}

/**
 * Attempts to determine the type from IDL statements separated by operators
 *
 * TODO: Well, not to-do, but we could add in logic for how to combine type values
 * where we have literal values present
 *
 * Addition, multiplication, string concatenation. All that would live here or as a part of type promotion
 */
export function TypeFromOperators(
  index: IDLIndex,
  parsed: IParsed,
  split: ISplitTreeOnOperators
): IDLDataType {
  /**
   * Get data types
   */
  const types = split.children.map((tree) =>
    TypeFromOperatorSplit(index, parsed, tree)
  );

  /**
   * If no types were found, return
   */
  if (types.length === 0) {
    return copy(IDL_ANY_TYPE);
  }

  /**
   * If we don't have any children to process, return
   */
  if (split.children.length === 1) {
    return types[0];
  }

  /**
   * If we dont have the right combination of operators and children, return
   *
   * Should have one more element for children (i.e. "one + two" has one operator and two "trees")
   */
  if (split.children.length !== split.operators.length + 1) {
    return copy(IDL_ANY_TYPE);
  }

  /**
   * If one of our types is "any", return that
   */
  for (let i = 0; i < types.length; i++) {
    if (IDLTypeHelper.isAnyType(types[i])) {
      return types[i];
    }

    // strip out the value
    IDLTypeHelper.removeValue(types[i]);
  }

  /**
   * Track current type, from left to right for IDL
   */
  let currentType: IDLDataType = types[0];

  // process each operator
  for (let i = 0; i < split.operators.length; i++) {
    /**
     * Return if "any" type
     */
    if (IDLTypeHelper.isAnyType(currentType)) {
      return currentType;
    }

    /** Get the actual operator */
    const op = split.operators[i].match[0].toLowerCase();

    /**
     * Determine how we handle it
     */
    switch (true) {
      /**
       * Check if we have a boolean operator which always
       * returns true or false
       */
      case op in BOOLEAN_OPERATORS:
        currentType = IDL_BOOLEAN_TYPE;
        break;

      /**
       * Check if we have a logical operator which manipulates the type
       */
      case op in LOGICAL_OPERATOR:
        /**
         * Determine the output from our logical operation
         */
        switch (true) {
          // comparison with lists
          case TypeCheck(currentType, types[i + 1], 'list'):
            currentType = LOGICAL_OUTPUT_TYPES.LIST;
            break;
          // comparison with hash
          case TypeCheck(currentType, types[i + 1], 'hash'):
            currentType = LOGICAL_OUTPUT_TYPES.HASH;
            break;
          // comparison with ordered hashes
          case TypeCheck(currentType, types[i + 1], 'orderedhash'):
            currentType = LOGICAL_OUTPUT_TYPES.ORDEREDHASH;
            break;
          // comparison with dictionaries
          case TypeCheck(currentType, types[i + 1], 'dictionary'):
            currentType = LOGICAL_OUTPUT_TYPES.DICTIONARY;
            break;
          // comparison with arrays
          case TypeCheck(currentType, types[i + 1], 'array'):
            currentType = LOGICAL_OUTPUT_TYPES.ARRAY;
            break;
          /**
           * Default to boolean since not iterable
           *
           * TODO: check for overload to see if we have more information here
           */
          default:
            currentType = IDL_BOOLEAN_TYPE;
            break;
        }
        break;
      /**
       * Promote our two types together
       */
      default:
        // type promotion
        currentType = TypePromotion(
          index,
          parsed,
          [currentType, types[i + 1]],
          split.startPos,
          split.endPos
        );
        break;
    }
  }

  return currentType;
}
