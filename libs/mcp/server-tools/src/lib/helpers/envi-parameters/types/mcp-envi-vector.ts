import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIVector(description: string) {
  return z
    .object({
      factory: z
        .literal('URLVector')
        .describe('This value should always be "URLVector"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the shapefile. Should end with a ".shp" extension.`
        ),
      auxiliary_url: z
        .array(z.string())
        .describe(
          'If a shapefile has any auxiliary files, specify them here. This can include .dbf, .ebb, .ed1, .eq1, .prj, .shp.qtr, .shp.sml and .shx files that are adjacent to the URL file. Only include files that exist.'
        )
        .optional(),
    })
    .describe(description);
}
