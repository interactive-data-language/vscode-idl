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

  /** Accumulate a resolved zod type per IDL type element */
  const results: z.ZodType[] = [];

  /**
   * Track a docs override set by URI type cases; the last URI type wins
   * so the description reflects what the caller will actually receive.
   */
  let docsOverride: string | undefined;

  /**
   * Iterate over every element in the type array and attempt to convert
   * each one. If any element cannot be mapped we bail out immediately.
   */
  for (let i = 0; i < type.length; i++) {
    const currentType = type[i];
    const currentTypeString = currentType.name.toLowerCase();

    /** Result for this individual type element */
    let res: undefined | z.ZodType;

    /**
     * Convert to ZOD
     */
    switch (true) {
      /**
       * Handle arrays of values and recurse
       */
      case currentTypeString === IDL_TYPE_LOOKUP.ARRAY.toLowerCase(): {
        /** Get type arguments for arrays (i.e. Array<TypeArg>) */
        const typeArgs = IDLTypeHelper.getAllTypeArgs([currentType]);

        /** Attempt to map our parameter - dont pass in docs, set below */
        const arrayType = IDLParameterToMCPParameter_Recurser(
          param,
          '',
          typeArgs,
        );

        // see if we mapped a parameter or not
        if (arrayType) {
          /** Check for dimensions */
          const dims = currentType.meta.dimensions || ['*'];

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
      case currentType.meta.isUri && currentType.meta.isFolder:
        res = MCP_ENVIURI();
        docsOverride =
          'Fully-qualified path to the output folder, default is "!" which indicates a temporary location will be created. Only set this when requested by user. If this is an output parameter, it MUST not be set to an existing folder on disk. You may need to examine the output location to find specific datasets.';
        break;

      /**
       * ENVI URI - File
       */
      case currentType.meta.isUri:
        res = MCP_ENVIURI();
        docsOverride =
          'Fully-qualified path to the output dataset, default is "!" which indicates a temporary file will be created. Only set this when requested by user. If this is an output parameter, it MUST not be set to an existing file on disk.';
        break;

      /**
       * Is there a type in our lookup?
       */
      case currentTypeString in MCP_TYPE_FACTORIES:
        res = MCP_TYPE_FACTORIES[currentTypeString](currentType);
        break;

      /**
       * Numbers
       */
      case currentTypeString === IDL_TYPE_LOOKUP.NUMBER.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.BIG_INTEGER.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.DOUBLE.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.FLOAT.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.UNSIGNED_LONG64.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.LONG64.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.UNSIGNED_LONG.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.LONG.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.UNSIGNED_INTEGER.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.INTEGER.toLowerCase():
      case currentTypeString === IDL_TYPE_LOOKUP.BYTE.toLowerCase():
        res = MCP_Number(
          currentType.value,
          currentType.meta.min,
          currentType.meta.max,
        );
        break;

      default:
        break;
    }

    /**
     * If any single type element could not be mapped the whole parameter
     * cannot be represented — return undefined immediately.
     */
    if (res === undefined) {
      return undefined;
    }

    // apply per-element default before accumulating
    if (typeof currentType.meta.default !== 'undefined') {
      res = res.default(currentType.meta.default).optional();
    }

    // save result
    results.push(res);
  }

  // nothing resolved (empty type array)
  // should be handled above, but sanity check
  if (results.length === 0) {
    return undefined;
  }

  /**
   * Combine all resolved types. A single result is used as-is; multiple
   * results are wrapped in a zod union.
   */
  let finalRes: z.ZodType =
    results.length === 1 ? results[0] : z.union(results);

  // add description if we have one (URI overrides take precedence)
  const trimmed = (docsOverride || cleanDocs).trim();
  if (trimmed) {
    finalRes = finalRes.describe(trimmed);
  }

  return finalRes;
}

/**
 * Converts a parameter to an MCP Parameter
 *
 * Iterates over all IDL types for the parameter. If any type cannot be
 * mapped the result is undefined. Multiple types are combined into a zod
 * union.
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
