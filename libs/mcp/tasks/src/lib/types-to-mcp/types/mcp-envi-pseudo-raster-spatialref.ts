import { z } from 'zod';

/**
 * Returns an ENVI Pseudo Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCP_ENVIPseudoRasterSpatialref(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('PseudoRasterSpatialRef')
        .refine((val) => val.toLowerCase() === 'pseudorasterspatialref', {
          message:
            'factory must be "PseudoRasterSpatialRef" (case-insensitive)',
        })
        .describe(
          'This value should be "PseudoRasterSpatialRef" (case-insensitive)'
        ),
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
