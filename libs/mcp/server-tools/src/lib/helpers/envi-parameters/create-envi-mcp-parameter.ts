import { IDL_TYPE_LOOKUP, IDLDataType, IDLTypeHelper } from '@idl/types/core';
import { z } from 'zod';

import { MCPENVIRaster } from './types/mcp-envi-raster';
import { MCPENVIROI } from './types/mcp-envi-roi';
import { MCPENVISpectralLibrary } from './types/mcp-envi-spectral-library';
import { MCPENVIVector } from './types/mcp-envi-vector';

export function CreateENVIMCPParameter(
  name: string,
  docs: string,
  type: IDLDataType
) {
  /**
   * Convert to ZOD
   */
  switch (true) {
    /**
     * Handle arrays of values
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ARRAY): {
      /** Get type arguments for arrays (i.e. Array<TypeArg>) */
      const typeArgs = IDLTypeHelper.getAllTypeArgs(type);

      /** Attempt to map our parameter */
      const arrayType = CreateENVIMCPParameter(name, '', typeArgs);

      // see if we mapped a parameter or not
      if (arrayType) {
        return z.array(arrayType).describe(docs);
      }

      break;
    }

    /**
     * ENVI URI
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.STRING) &&
      name.endsWith('uri'):
      return z
        .literal('*')
        .describe(
          'Path to the output raster, should be a literal "*" which indicates a temporary file will be created.'
        );

    /**
     * Raster
     */
    case IDLTypeHelper.isType(type, 'enviraster'):
      return MCPENVIRaster(docs);

    /**
     * ROI
     */
    case IDLTypeHelper.isType(type, 'enviroi'):
      return MCPENVIROI(docs);

    /**
     * Passwords - map to proper parameters when we
     * run the task
     */
    case IDLTypeHelper.isType(type, 'envisecurestring'):
      return z.string().describe(docs);

    /**
     * ENVI spectral index
     */
    case IDLTypeHelper.isType(type, 'envispectralindex'):
      return z.string().describe(docs);

    /**
     * ENVI spectral library
     */
    case IDLTypeHelper.isType(type, 'envispectrallibrary'):
      return MCPENVISpectralLibrary(docs);

    /**
     * Vector
     */
    case IDLTypeHelper.isType(type, 'envivector'):
      return MCPENVIVector(docs);

    /**
     * String
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.STRING):
      return z.string().describe(docs);

    /**
     * Bool
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BOOLEAN):
      return z.boolean().describe(docs);

    /**
     * Numbers
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.NUMBER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BIG_INTEGER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.DOUBLE):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.FLOAT):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.UNSIGNED_LONG64):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.LONG64):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.UNSIGNED_LONG):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.LONG):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.UNSIGNED_INTEGER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.INTEGER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BYTE):
      return z.number().describe(docs);

    default:
      break;
  }
}
