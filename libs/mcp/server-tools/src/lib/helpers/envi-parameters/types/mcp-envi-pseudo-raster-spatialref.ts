import { z } from 'zod';

/**
 * Returns an ENVI Pseudo Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCPENVIPseudoRasterSpatialref(description: string) {
  return z
    .object({
      factory: z
        .literal('PseudoRasterSpatialRef')
        .describe('This value should always be "PseudoRasterSpatialRef"'),
      pseudo_geo_point_1: z
        .array(z.number())
        .length(4)
        .describe(
          `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying a geographic corner.`
        ),
      pseudo_geo_point_2: z
        .array(z.number())
        .length(4)
        .describe(
          `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying a geographic corner.`
        ),
      pseudo_geo_point_3: z
        .array(z.number())
        .length(4)
        .describe(
          `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying a geographic corner.`
        ),
      pseudo_geo_point_4: z
        .array(z.number())
        .length(4)
        .describe(
          `A four-element array [X Pixel, Y Pixel, Longitude, Latitude] specifying a geographic corner.`
        ),
    })
    .describe(
      `${description}\n\nNote: the pseudo_geo_points don't need to be in a specific order. Typically they represent the top left, lower left, lower right, and top right corner of the image.`
    );
}
