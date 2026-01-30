import { z } from 'zod';

/**
 * Returns an ENVI Pseudo Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCP_ENVIPseudoRasterSpatialref() {
  return z.object({
    factory: z
      .string()
      .default('PseudoRasterSpatialRef')
      .refine((val) => val.toLowerCase() === 'pseudorasterspatialref', {
        message: 'factory must be "PseudoRasterSpatialRef" (case-insensitive)',
      })
      .describe(
        'This value should be "PseudoRasterSpatialRef" (case-insensitive)'
      ),
    pseudo_geo_point_1: z
      .array(z.number())
      .length(4)
      .describe(
        `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying the top-left geographics.`
      ),
    pseudo_geo_point_2: z
      .array(z.number())
      .length(4)
      .describe(
        `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying the lower-left geographic corner.`
      ),
    pseudo_geo_point_3: z
      .array(z.number())
      .length(4)
      .describe(
        `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying the lower-right geographic corner.`
      ),
    pseudo_geo_point_4: z
      .array(z.number())
      .length(4)
      .describe(
        `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying the upper-right geographic corner.`
      ),
  });
}
