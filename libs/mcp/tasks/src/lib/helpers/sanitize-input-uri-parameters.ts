import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IPropertyLookup,
} from '@idl/types/idl-data-types';
import { basename } from 'path';

/** Default extension to use when a URI parameter has no known extension */
const DEFAULT_URI_EXTENSION = '.dat';

/**
 * Grabs first extension to the end of the string
 */
const EXT_REGEX = /\..*$/i;

/**
 * Gets full extension when files have multiple "."s in them
 */
function GetExtension(str: string) {
  const match = EXT_REGEX.exec(str);
  if (match !== null) {
    return match[0];
  } else {
    return '';
  }
}

/**
 * Appends the expected file extension to a URI value.
 *
 * Temp-file markers ("!" and "#") are returned as-is, and a value that
 * already ends with the expected extension is left untouched.
 *
 * This used to live in a zod `.transform()` on `MCP_ENVIURI`, but zod v4's
 * `toJSONSchema` cannot represent transforms and throws when it encounters
 * one. Instead, this is applied separately as a sanitization step - see
 * `MCPTaskRegistry.sanitizeInputParameters`.
 */
export function AddENVIUriExtension(val: string, extension: string): string {
  // temp files and folders are left as-is
  if (!val || val === '!' || val === '#') {
    return val;
  }

  /** Normalize our file extension */
  const normExt = (
    extension[0] === '.' ? extension : `.${extension}`
  ).toLowerCase();

  /** Get extension (includes leading dot) */
  const found = GetExtension(basename(val)).toLowerCase();

  // already has the correct extension
  if (found === normExt) {
    return val;
  }

  // strip off any existing (incorrect) extension before appending ours
  const base = found ? val.slice(0, val.length - found.length) : val;

  return base + normExt;
}

/**
 * Looks up URI metadata for a parameter type, unwrapping arrays so we can
 * detect URI parameters like `Array<ENVIRaster>`
 */
function GetUriMeta(type: IDLDataType) {
  const useType = IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ARRAY)
    ? IDLTypeHelper.getAllTypeArgs(type)
    : type;

  if (!IDLTypeHelper.getMetaKey(useType, 'isUri')) {
    return undefined;
  }

  return {
    isFolder: !!IDLTypeHelper.getMetaKey(useType, 'isFolder'),
    autoExtension: IDLTypeHelper.getMetaKey(useType, 'autoExtension') as
      | string
      | undefined,
  };
}

/**
 * Auto-appends the expected file extension to input parameters that are
 * URIs, mutating `inputParameters` in place.
 *
 * Folders are skipped since they don't have a file extension to enforce.
 */
export function SanitizeInputUriParameters(
  props: IPropertyLookup,
  inputParameters: { [key: string]: any },
) {
  const names = Object.keys(props);

  for (let i = 0; i < names.length; i++) {
    const prop = props[names[i]];

    // only look at input parameters that were actually specified
    if (prop.direction === 'out') {
      continue;
    }
    if (!(names[i] in inputParameters)) {
      continue;
    }

    /** Check if we have a URI parameter, skip folders */
    const uriMeta = GetUriMeta(prop.type);
    if (uriMeta === undefined || uriMeta.isFolder) {
      continue;
    }

    /** Extension to enforce for this parameter */
    const extension = uriMeta.autoExtension || DEFAULT_URI_EXTENSION;

    /** Value we are sanitizing, could be a single URI or an array of them */
    const value = inputParameters[names[i]];

    if (Array.isArray(value)) {
      inputParameters[names[i]] = value.map((val) =>
        typeof val === 'string' ? AddENVIUriExtension(val, extension) : val,
      );
    } else if (typeof value === 'string') {
      inputParameters[names[i]] = AddENVIUriExtension(value, extension);
    }
  }
}
