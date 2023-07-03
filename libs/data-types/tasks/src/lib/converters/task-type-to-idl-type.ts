import { ParseIDLType } from '@idl/data-types/core';

/**
 * Regular expression to check for array data types and allows us to strip
 * array from the names
 */
const ARRAY_REGEX = /array$|\[[^\]]\]?$/i;

/**
 * Cleans up URI parameters and makes them make logical sense to users :)
 */
const CLEAN_URI_REGEX = /enviuri|ENVIVirtualizableURI/i;

/**
 * Takes an arbitrary data type from a task and converts it to an
 * IDL data type.
 */
export function TaskTypeToIDLType(type: string) {
  // convert URIs to strings
  type = type.replace(CLEAN_URI_REGEX, 'string');

  // check if we have an array
  const match = ARRAY_REGEX.exec(type);
  if (match !== null) {
    return ParseIDLType(`Array<${type.substring(0, match.index)}>`);
  } else {
    return ParseIDLType(type);
  }
}
