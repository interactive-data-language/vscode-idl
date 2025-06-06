import { IDLDataType, IDLTypeHelper } from '@idl/types/core';
import { z } from 'zod';

import { MCPENVIRaster } from './mcp-envi-raster';
import { MCPENVIVector } from './mcp-envi-vector';

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
    case IDLTypeHelper.isType(type, 'array'): {
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
    case IDLTypeHelper.isType(type, 'string') && name.endsWith('uri'):
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
     * ENVI spectral index
     */
    case IDLTypeHelper.isType(type, 'envispectralindex'):
      return z.string().describe(docs);

    /**
     * Vector
     */
    case IDLTypeHelper.isType(type, 'envivector'):
      return MCPENVIVector(docs);

    /**
     * String
     */
    case IDLTypeHelper.isType(type, 'string'):
      return z.string().describe(docs);

    /**
     * Bool
     */
    case IDLTypeHelper.isType(type, 'boolean'):
      return z.boolean().describe(docs);

    default:
      break;
  }
}
