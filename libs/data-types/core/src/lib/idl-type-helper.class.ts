import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
} from './idl-data-types.interface';
import { SerializeIDLType } from './serializing/serialize-idl-type';

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
    let useDocs: string[];

    // check if we have a literal value and single type
    if (typeInfo.length === 1 && typeInfo[0].value !== undefined) {
      let val: string;
      switch (true) {
        case typeInfo[0].name === IDL_TYPE_LOOKUP.STRING: {
          // determine the kind of quote to use
          switch (true) {
            case typeInfo[0].value.startsWith("'"):
              val = typeInfo[0].value;
              break;
            case typeInfo[0].value.startsWith('"'):
              val = typeInfo[0].value;
              break;
            default:
              val = `'${typeInfo[0].value}'`;
              break;
          }
          break;
        }
        default:
          val = typeInfo[0].value;
          break;
      }
      // initialize docs with type
      useDocs = [
        '```typescript',
        `var ${name}: ${SerializeIDLType(typeInfo)} = ${val}`,
        '```',
      ];
    } else {
      // initialize docs with type
      useDocs = [
        '```typescript',
        `type ${name} = ${SerializeIDLType(typeInfo)}`,
        '```',
      ];
    }

    // add in our actual docs
    if (docs !== '') {
      useDocs.push('', docs);
    }

    // join strings and return
    return useDocs.join('\n');
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
   * Checks if a data type is a value of any
   */
  static isAnyType(type: IDLDataType) {
    return this.isType(type, IDL_TYPE_LOOKUP.ANY);
  }

  /**
   * Takes an IDL data type and reduces it to remove any duplicate types
   */
  static reduceIDLDataType(type: IDLDataType): IDLDataType {
    // return original if we dont have anything to reduce
    if (type.length < 2) {
      return type;
    }

    // track what we have found
    const found: { [key: string]: IDLDataTypeBase<string> } = {};

    // process each type
    for (let i = 0; i < type.length; i++) {
      if (!(type[i].display.toLowerCase() in found)) {
        found[type[i].display.toLowerCase()] = type[i];
      }
    }

    return Object.values(found);
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
        mapped = mapped.concat(type[i].args[0]);
      } else {
        mapped.push(type[i]);
      }
    }

    // reduce and return
    return this.reduceIDLDataType(mapped);
  }
}
