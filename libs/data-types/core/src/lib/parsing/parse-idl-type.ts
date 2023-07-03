import {
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
} from '../idl-data-types.interface';
import { ReduceIDLDataType } from '../serializing/reduce-types';
import { PARSED_TO_KNOWN_TYPES } from './parsed-to-known-type-map.interface';
import { PopulateDisplayName } from './populate-display-name';
import { SetDefaultTypes } from './set-default-types';
import { SplitType } from './split-type';

/**
 * Regular expression for parsing types
 *
 * TODO: Broken, because we need recursion so we need code parsing
 */
export const TYPE_REGEX = /([a-z_0-9$!'"=]+)\s*(?:<([^>]*)>)?\s*\|?/im;

/**
 * Regular expression for parsing type documentation that is used
 * to nicely split parsed docs without using commas
 */
export const TYPE_DOCS_REGEX = /((?:[a-z_0-9$!'"=]+\s*(?:<.*>)?\s*\|?\s*)+)/im;

/**
 * Regular expression to split on type args
 */
export const TYPE_ARGS_REGEX = /((?:[a-z_0-9$!'"=]+\s*(?:<.+>)?\s*\|?)*),/im;

/**
 * Regular expression to detect ENVI or IDL tasks so we can nicely format the display name
 */
const TASK_REGEX = /^(?:ENVI|IDL)(.+)Task$/i;

/**
 * Takes the type from IDL docs and returns more detailed type information
 *
 * Placeholder for future work. Tied in so that we have the pieces to extend
 * in the future
 */
export function _ParseTheTypes(type: string): IDLDataType {
  // init result
  const types: IDLDataType = [];

  // remove `type` from the string
  const use = type.replace(/type\s*=\s*/gim, '').trim();

  // return if nothing to process
  if (use === '') {
    return types;
  }

  /**
   * Split strings using regex so we dont have to recurse or have complicated loops
   *
   * Structure is ['', 'type', 'typeArgs', ''], we always skip the last element
   *
   * If we don't have type args, they are undefined
   */
  const split: string[] = [];
  SplitType(use, split);

  // process all of our split entries
  for (let i = 0; i < split.length - 1; i += 2) {
    let baseType = split[i];
    let displayType = baseType;
    let typeArgs = split[i + 1];

    /**
     * Handle task parsing
     */
    if (TASK_REGEX.test(baseType)) {
      typeArgs = TASK_REGEX.exec(baseType)[1];
      if (baseType.toLowerCase().startsWith('envi')) {
        baseType = 'ENVITask';
        displayType = `ENVITask<${typeArgs}>`;
      } else {
        baseType = 'IDLTask';
        displayType = `IDLTask<${typeArgs}>`;
      }
    }

    // init type
    const thisType: IDLDataTypeBase<IDLTypes> = {
      name: baseType,
      display: displayType,
      args: [],
      meta: {},
    };

    // set the name of the data type
    if (thisType.name.toLowerCase() in PARSED_TO_KNOWN_TYPES) {
      thisType.name = PARSED_TO_KNOWN_TYPES[thisType.name.toLowerCase()];
    }

    // check for type args
    if (typeArgs !== undefined && typeArgs.trim() !== '') {
      thisType.args.push(ParseIDLType(typeArgs));
    }

    // make our type
    types.push(thisType);
  }

  // return what we created
  return types;
}

/**
 * Takes the type from IDL docs and returns more detailed type information
 *
 * Placeholder for future work. Tied in so that we have the pieces to extend
 * in the future
 */
export function ParseIDLType(type: string): IDLDataType {
  // extract types
  const types = _ParseTheTypes(type);

  // set type defaults
  SetDefaultTypes(types);

  // set display names
  PopulateDisplayName(types);

  // reduce types so that, if we have duplicates, we remove them
  const reduced = ReduceIDLDataType(types);

  // remove duplicates and return
  return reduced;
}
