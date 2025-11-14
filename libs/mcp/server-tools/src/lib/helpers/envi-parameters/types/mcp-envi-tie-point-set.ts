import { z } from 'zod';

import { MCPENVIRaster } from './mcp-envi-raster';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVITiePointSet(description: string) {
  return z
    .object({
      factory: z
        .literal('URLTiePointSet')
        .describe('This value should always be "URLTiePointSet"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the tie points. Should end with a ".pts" extension.`
        ),
      input_raster1: MCPENVIRaster(
        'The reference image for tiepoint creation'
      ).optional(),
      input_raster2: MCPENVIRaster(
        'The warp image for tiepoint creation (i.e. tiepoints map from second image to the first)'
      ).optional(),
    })
    .describe(description);
}
