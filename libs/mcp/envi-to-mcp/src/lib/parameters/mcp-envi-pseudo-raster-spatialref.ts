import { z } from 'zod';

/**
 * Returns an ENVI Pseudo Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCP_ENVIPseudoRasterSpatialref() {
  return z.object({
    factory: z.literal('PseudoRasterSpatialRef'),
    pseudo_geo_point_1: z
      .array(z.number())
      .length(4)
      .describe(
        `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying the top-left geographic corner.`
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
