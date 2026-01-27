import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

/**
 * Returns an ENVI Standard Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCP_ENVIStandardRasterSpatialref(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('StandardRasterSpatialRef')
        .refine((val) => val.toLowerCase() === 'standardrasterspatialref', {
          message:
            'factory must be "StandardRasterSpatialRef" (case-insensitive)',
        })
        .describe(
          'This value should be "StandardRasterSpatialRef" (case-insensitive)'
        ),
      coord_sys_code: z
        .number()
        .int()
        .optional()
        .describe('GEOGCS or PROJCS coordinate system code (EPSG).'),
      coord_sys_str: z
        .string()
        .optional()
        .describe('GEOGCS or PROJCS coordinate system string.'),
      geogcs: z
        .boolean()
        .optional()
        .describe(
          'Set true when retrieving a geographic (GEOGCS) code or string with coord_sys_code / coord_sys_str.'
        ),
      projcs: z
        .boolean()
        .optional()
        .describe(
          'Set true when retrieving a projected (PROJCS) code or string with coord_sys_code / coord_sys_str.'
        ),
      pixel_size: z
        .array(z.number())
        .length(2)
        .describe('[X Pixel Size, Y Pixel Size] in coordinate system units.'),
      rotation: z
        .number()
        .optional()
        .describe('Rotation in degrees clockwise from North.'),
      tie_point_map: z
        .array(z.number())
        .length(2)
        .describe(
          '[X Tie Point, Y Tie Point] map location corresponding to tie_point_pixel.'
        ),
      tie_point_pixel: z
        .array(z.number())
        .length(2)
        .describe(
          '[X Pixel, Y Pixel] pixel location corresponding to tie_point_map. If taken from ENVI header (one-based), subtract 1 from both.'
        ),
    })
    .describe(
      `${description}\n\nTo fetch the spatial reference for a dataset, use the "spatialref" property returned from the ${MCP_TOOL_LOOKUP.ENVI_QUERY_DATASET} tool. However, rasters may not always have this type of spatial reference.`
    );
}
