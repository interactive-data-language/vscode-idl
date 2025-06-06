import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIVector(description: string) {
  return z.object({
    factory: z
      .literal('URLVector')
      .describe('This value should always be "URLVector"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the shapefile on disk (.shp)`
      ),
    auxiliary_url: z
      .array(z.string())
      .describe(
        'If a shapefile has any auxiliary files, specify them here. This can include .dbf, .ebb, .ed1, .eq1, .prj, .shp.qtr, .shp.sml and .shx files that are adjacted to the URL file. Only include files that exist.'
      )
      .optional(),
  });
}
