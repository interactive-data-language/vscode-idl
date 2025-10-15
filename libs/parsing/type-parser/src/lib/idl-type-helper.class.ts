import {
  ICreateIDLDataType,
  IDL_TYPE_LOOKUP,
  IDLDataType,
} from '@idl/types/idl-data-types';

import { ReduceIDLDataType } from './helpers/reduce-types';
import { ParseIDLType, PostProcessIDLType } from './parsing/parse-idl-type';
import { PopulateTypeDisplayName } from './parsing/populate-type-display-name';

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
    typeInfo: IDLDataType,
    // these should be reflected in the "type_definition" regex in
    // extension\language\syntaxes\src\idl.tmLanguage.yaml
    helpType: 'arg' | 'kw' | 'prop' | 'struct' | 'var' = 'var'
  ): string {
    /** Docs we add for hover help */
    let useDocs: string[];

    /** Get display type */
    const display = this.serializeIDLType(typeInfo, true);

    /** Get serialized type */
    const serialized = this.serializeIDLType(typeInfo, false);

    /**
     * If we have a difference between display and serialized, then show both
     */
    if (display !== serialized) {
      useDocs = [
        '```idl',
        `${helpType} ${name}: ${display} = ${serialized}`,
        '```',
      ];
    } else {
      useDocs = ['```idl', `${helpType} ${name}: ${display}`, '```'];
    }

    // add in our actual docs
    if (docs !== '') {
      useDocs.push('', docs);
    }

    // join strings and return
    return useDocs.join('\n');
  }

  /**
   * Add a value to a type
   *
   * Adds to the first type assuming we have one
   */
  static addValueToFirstType(type: IDLDataType, value: string[]) {
    if (type.length === 0) {
      return;
    }

    // set value
    type[0].value = value;

    // set display names
    PopulateTypeDisplayName(type);
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
  static createIDLType(type: ICreateIDLDataType[]) {
    return PostProcessIDLType(
      type.map((iType) => {
        return {
          name: iType.name,
          display: '',
          serialized: '',
          args: iType.args,
          meta: {},
        };
      })
    );
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
   * Check if our type is a literal type
   *
   * This means that one of the types (if more than one) has
   * literal values present
   */
  static isLiteralType(type: IDLDataType): boolean {
    for (let i = 0; i < type.length; i++) {
      if (Array.isArray(type[i].value)) {
        return true;
      }
    }
    return false;
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
    if (IDLTypeHelper.isAnyType(type) || type.length === 0) {
      return IDL_TYPE_LOOKUP.ANY;
    }

    // // remove any duplicate types since we are likely saving
    // const reduced = IDLTypeHelper.reduceIDLDataType(type);

    // not any, so do our thing
    let name = '';
    for (let i = 0; i < type.length; i++) {
      // add or operator to the name if we have one already
      if (i > 0) {
        name += ' | ';
      }

      // check if we need to use our display name for a nice visual
      if (useDisplayName) {
        name += type[i].display;
      } else {
        name += type[i].serialized;
      }
    }
    return name;
  }
}
