import { z } from 'zod';

/**
 * Returns an ENVI Standard Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCP_ENVIStandardRasterSpatialref() {
  return z.object({
    factory: z.literal('StandardRasterSpatialRef'),
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
  });
}
