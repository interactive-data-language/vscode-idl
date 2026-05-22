import { MCP_ENVIURI } from '@idl/mcp/envi-to-mcp';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IParameterOrPropertyDetails,
} from '@idl/types/idl-data-types';
import { z } from 'zod';

import { MCP_TYPE_FACTORIES } from './mcp-type-factory-lookup';
import { MCP_Number } from './types/mcp-number';

/**
 * Actually convert our parameter to an MCP parameter
 *
 * This recurses if we have an array, can be updated to manage
 * multiple types like we get from IDL code.
 */
function IDLParameterToMCPParameter_Recurser(
  param: IParameterOrPropertyDetails,
  cleanDocs: string,
  type?: IDLDataType,
): undefined | z.ZodType {
  // default type if it wasn't specified
  if (!type) {
    type = param.type;
  }

  /** Extract the first type */
  const firstType = type[0];

  /** Get type name as a string */
  const firstTypeString = firstType.name.toLowerCase();

  /** Initialize return value */
  let res: undefined | z.ZodType;

  /**
   * Convert to ZOD
   */
  switch (true) {
    /**
     * Handle arrays of values and recurse
     */
    case firstTypeString === IDL_TYPE_LOOKUP.ARRAY.toLowerCase(): {
      /** Get type arguments for arrays (i.e. Array<TypeArg>) */
      const typeArgs = IDLTypeHelper.getAllTypeArgs([firstType]);

      /** Attempt to map our parameter - dont pass in docs, set below */
      const arrayType = IDLParameterToMCPParameter_Recurser(
        param,
        '',
        typeArgs,
      );

      // see if we mapped a parameter or not
      if (arrayType) {
        /** Check for dimensions */
        const dims = type[0].meta.dimensions || ['*'];

        /**
         * Populate the dimension
         *
         * Note that this *REVERSES* the dimension order from IDL because
         * we set the innermost dimension to the outermost which changes
         * the row/column major-ness from IDL and JS
         *
         * In IDL we also have a transpose from list to array to match what IDL
         * expects.
         */
        let current = arrayType;
        for (let g = 0; g < dims.length; g++) {
          if (dims[g] === '*') {
            current = z.array(current);
          } else {
            current = z.array(current).length(dims[g] as number);
          }
        }
        res = current;
      }
      break;
    }

    /**
     * ENVI URI - Folder
     */
    case firstType.meta.isUri && firstType.meta.isFolder:
      res = MCP_ENVIURI();
      cleanDocs =
        'Fully-qualified path to the output folder, default is "!" which indicates a temporary location will be created. Only set this when requested by user. If this is an output parameter, it MUST not be set to an existing folder on disk. You may need to examine the output location to find specific datasets.';
      break;

    /**
     * ENVI URI - Folder
     */
    case firstType.meta.isUri:
      res = MCP_ENVIURI();
      cleanDocs =
        'Fully-qualified path to the output dataset, default is "!" which indicates a temporary file will be created. Only set this when requested by user. If this is an output parameter, it MUST not be set to an existing file on disk.';
      break;

    /**
     * Is there a type in our lookup?
     */
    case firstTypeString in MCP_TYPE_FACTORIES:
      res = MCP_TYPE_FACTORIES[firstTypeString](firstType);
      break;

    /**
     * Numbers
     */
    case firstTypeString === IDL_TYPE_LOOKUP.NUMBER.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.BIG_INTEGER.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.DOUBLE.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.FLOAT.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.UNSIGNED_LONG64.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.LONG64.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.UNSIGNED_LONG.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.LONG.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.UNSIGNED_INTEGER.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.INTEGER.toLowerCase():
    case firstTypeString === IDL_TYPE_LOOKUP.BYTE.toLowerCase():
      res = MCP_Number(firstType.value, firstType.meta.min, firstType.meta.max);
      break;

    default:
      break;
  }

  /**
   * Populate some additional root-level properties based on the first type
   * metadata and parameter docs
   */
  if (res) {
    // check for default
    if (typeof firstType.meta.default !== 'undefined') {
      res = res.default(firstType.meta.default);
    }

    // add description if we have one
    const trimmed = cleanDocs.trim();
    if (trimmed) {
      res = res.describe(trimmed);
    }
  }

  return res;
}

/**
 * Converts a parameter to an MCP Parameter
 *
 * Assumes that we only have one type for the input parameter because
 * that's what we have for tasks.
 *
 * Could be updated to support any IDL type with unions and iterating
 * through all possible types, but we don't need that right now.
 */
export function IDLParameterToMCPParameter(
  param: IParameterOrPropertyDetails,
  cleanDocs: string,
  type?: IDLDataType,
): undefined | z.ZodType {
  /**
   * Recurse into the data type and populate
   */
  let res = IDLParameterToMCPParameter_Recurser(param, cleanDocs, type);

  // set as optional if not required
  if (res) {
    if (!param.req) {
      res = res.optional();
    }
  }

  return res;
}
