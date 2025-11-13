import { IDLTypeHelper } from '@idl/parsing/type-parser';

/**
 * Regular expression to check for array data types and allows us to strip
 * array from the names
 */
const ARRAY_REGEX = /array$|\[.*]?$/i;

/**
 * Cleans up URI parameters and makes them make logical sense to users :)
 */
const CLEAN_URI_REGEX = /enviuri|ENVIVirtualizableURI/i;

/**
 * Gets array values or keys for a choice list in a task parameter
 */
function GetArrayOrKeys(value: unknown): any[] {
  if (Array.isArray(value)) {
    return value; // it's already an array
  } else if (value !== null && typeof value === 'object') {
    return Object.keys(value); // it's an object → return its keys
  }
  return []; // fallback if it's neither
}

/**
 * Takes an arbitrary data type from a task and converts it to an
 * IDL data type.
 */
export function TaskTypeToIDLType(type: string, choiceList?: any) {
  // convert URIs to strings
  type = type.replace(CLEAN_URI_REGEX, 'string');

  /**
   * Track values of our type
   */
  let values: string[];

  /**
   * Check if there's a choice list to set as the value of the type
   */
  if (choiceList !== undefined) {
    const keys = GetArrayOrKeys(choiceList).map((val) => `${val}`);

    // check if we have keys
    if (keys.length > 0) {
      values = keys;
    }
  }

  // check if we have an array
  const match = ARRAY_REGEX.exec(type);
  if (match !== null) {
    return IDLTypeHelper.createIDLType([
      {
        name: 'Array',
        args: [
          IDLTypeHelper.createIDLType([
            {
              name: type.substring(0, match.index),
              args: [],
              value: values,
            },
          ]),
        ],
      },
    ]);
  } else {
    return IDLTypeHelper.createIDLType([
      {
        name: type,
        args: [],
        value: values,
      },
    ]);
  }
}
