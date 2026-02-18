import { z } from 'zod';

import { MCP_ENVIRaster } from './mcp-envi-raster';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVITiePointSet() {
  return z.object({
    factory: z
      .string()
      .default('URLTiePointSet')
      .refine((val) => val.toLowerCase() === 'urltiepointset', {
        message: 'factory must be "URLTiePointSet" (case-insensitive)',
      })
      .describe('This value should be "URLTiePointSet" (case-insensitive)'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.pts'), {
        message: 'url must end with ".pts"',
      })
      .describe(
        `Provide a fully-qualified filepath to the tie points. Should end with a ".pts" extension.`
      ),
    input_raster1: MCP_ENVIRaster()
      .optional()
      .describe('The reference image for tiepoint creation'),
    input_raster2: MCP_ENVIRaster()
      .optional()
      .describe(
        'The warp image for tiepoint creation (i.e. tiepoints map from second image to the first)'
      ),
  });
}
