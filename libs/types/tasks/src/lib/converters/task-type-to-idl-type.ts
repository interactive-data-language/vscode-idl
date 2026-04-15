import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IDLDataTypeBaseMetadata } from '@idl/types/idl-data-types';

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
 * Converts a dimensions string to a number
 *
 * Ex: "[3,2,*]" to [3, 2, "*"]
 */
function DimensionsToNumber(dims: string): ('*' | number)[] {
  // Remove brackets and split by comma
  const cleaned = dims.replace(/[[\]]/g, '').trim();
  if (!cleaned) {
    return [];
  }

  // Split by comma and convert each element
  return cleaned.split(',').map((dim) => {
    const trimmed = dim.trim();
    return trimmed === '*' ? '*' : Number(trimmed);
  });
}

/**
 * Takes an arbitrary data type from a task and converts it to an
 * IDL data type.
 */
export function TaskTypeToIDLType(
  type: string,
  metadata: IDLDataTypeBaseMetadata,
  choiceList?: any,
  dimensions?: number[] | string,
) {
  /** Check for URI parameter */
  const isUri = CLEAN_URI_REGEX.test(type);

  /** Check for array data type */
  const isArray = ARRAY_REGEX.test(type);

  // set dimensions
  if (isArray && !dimensions) {
    const match = /\[.*?\]/.exec(type);
    if (match !== null) {
      dimensions = match[0];
    }
  }

  /** Map some ENVI types to better formats */
  const useType = type
    .replace(CLEAN_URI_REGEX, 'string')
    .replace(ARRAY_REGEX, '');

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

  /** Create base type */
  let created = IDLTypeHelper.createIDLType([
    {
      name: useType,
      args: [],
      value: values,
    },
  ]);

  // save metadata
  created[0].meta = { ...created[0].meta, ...metadata };

  // save if we are a URI
  if (isUri) {
    created[0].meta.isUri = true;
  }

  // check if we need to prompt to an array
  if (isArray) {
    created = IDLTypeHelper.createIDLType([
      {
        name: 'Array',
        args: [created],
      },
    ]);

    // add dimensions
    if (dimensions) {
      created[0].meta.dimensions = DimensionsToNumber(
        Array.isArray(dimensions) ? JSON.stringify(dimensions) : dimensions,
      );
    }
  }

  return created;
}
