import { IDL_TYPE_LOOKUP, IDLDataType } from '@idl/types/idl-data-types';

import { ReduceIDLDataType } from './helpers/reduce-types';
import { ParseIDLType, PostProcessIDLType } from './parsing/parse-idl-type';

/**
 * Helper class with static methods for working with types to make
 * type processing accessible in a centralized location without
 * the need for many imports.
 */
export class IDLTypeHelper {
  /**
   * Adds type information to docs for arguments, keywords, or variables.
   *
   * Uses Markdown syntax highlighting to make the type detail pop out with
   * typescript style syntax.
   */
  static addTypeToDocs(
    name: string,
    docs: string,
    typeInfo: IDLDataType
  ): string {
    /** Docs we add for hover help */
    const useDocs: string[] = [
      '```typescript',
      `var ${name}: ${this.serializeIDLType(
        typeInfo,
        true
      )} = ${this.serializeIDLType(typeInfo)}`,
      '```',
    ];

    // add in our actual docs
    if (docs !== '') {
      useDocs.push('', docs);
    }

    // join strings and return
    return useDocs.join('\n');
  }

  /**
   * Reduces data types for purposes of array creation using brackets
   */
  static arrayReduce(type: IDLDataType): IDLDataType {
    /**
     * Map types to array-compatible versions where we can add
     * scalars and arrays of the same type (including objects) together
     */
    let mapped: IDLDataType = [];
    for (let i = 0; i < type.length; i++) {
      if (type[i].name === IDL_TYPE_LOOKUP.ARRAY) {
        /** Because we have an array, recurse */
        mapped = mapped.concat(IDLTypeHelper.arrayReduce(type[i].args[0]));
      } else {
        mapped.push(type[i]);
      }
    }

    // reduce and return
    return this.reduceIDLDataType(mapped);
  }

  /**
   * Manually creates an IDL Data Type and sets values
   * as if we are parsing from scratch
   */
  static createIDLType(type: IDLDataType) {
    return PostProcessIDLType(type);
  }

  /**
   * Returns all type arguments from the given data type
   */
  static getAllTypeArgs(type: IDLDataType): IDLDataType {
    const withArgs = this.getTypesWithArgs(type);

    // get all possible return types, first type argument for any compound type
    let possibleTypes: IDLDataType = [];
    for (let i = 0; i < withArgs.length; i++) {
      possibleTypes = possibleTypes.concat(withArgs[i].args[0]);
    }

    return possibleTypes;
  }

  /**
   * Return types matching our filter
   */
  static getMatchingTypes(type: IDLDataType, findThis: string): IDLDataType {
    const found: IDLDataType = [];
    for (let i = 0; i < type.length; i++) {
      if (type[i].name === findThis) {
        found.push(type[i]);
      }
    }
    return found;
  }

  /**
   * Returns the first matching meta key from our data type.
   *
   * Returns undefined if nothing is found
   */
  static getMetaKey(type: IDLDataType, key: string) {
    for (let i = 0; i < type.length; i++) {
      if (key in type[i].meta) {
        return type[i].meta[key];
      }
    }

    return undefined;
  }

  /**
   * Returns the data types that have type arguments
   */
  static getTypesWithArgs(type: IDLDataType): IDLDataType {
    return type.filter((item) => item.args.length > 0);
  }

  /**
   * Checks if a data type is a value of any
   */
  static isAnyType(type: IDLDataType) {
    return this.isType(type, IDL_TYPE_LOOKUP.ANY);
  }

  /**
   * Checks if a data type matches a user specified value (case-insensitive)
   *
   * Only checks for presence, doesn't filter out for "any"
   */
  static isType(type: IDLDataType, checkType: string): boolean {
    for (let i = 0; i < type.length; i++) {
      if (type[i].name.toLowerCase() === checkType.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Parse IDL data type
   */
  static parseIDLType(type: string) {
    return ParseIDLType(type);
  }

  /**
   * Takes an IDL data type and reduces it to remove any duplicate types
   */
  static reduceIDLDataType(type: IDLDataType): IDLDataType {
    return ReduceIDLDataType(type);
  }

  /**
   * Remove literal values
   */
  static removeValue(type: IDLDataType) {
    for (let i = 0; i < type.length; i++) {
      delete type[i].value;
    }
  }

  /**
   * Turn an IDL Data Type into a string
   *
   * Note that this is one way - we lose context for our code about compile
   * options if we serialize a type
   */
  static serializeIDLType(type: IDLDataType, useDisplayName?: boolean) {
    // check for any
    if (IDLTypeHelper.isAnyType(type)) {
      return IDL_TYPE_LOOKUP.ANY;
    }

    // remove any duplicate types since we are likely saving
    const reduced = IDLTypeHelper.reduceIDLDataType(type);

    // not any, so do our thing
    let name = '';
    for (let i = 0; i < reduced.length; i++) {
      // add or operator to the name if we have one already
      if (name) {
        name += ' | ';
      }

      // check if we need to use our display name for a nice visual
      if (useDisplayName) {
        name += reduced[i].display;
        continue;
      }

      /**
       * Merge back together
       *
       * If we have values, use those, because we parse them to get back
       * to exactly what we had before
       *
       * If we dont have values, then check input flag for whether we
       * use the display or normal name
       */
      if (Array.isArray(reduced[i].value)) {
        name += reduced[i].value.join(' | ');
      } else {
        name += reduced[i].name;
      }
    }
    return name;
  }
}
