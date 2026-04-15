import { z } from 'zod';

/**
 * Returns a representation of the product information from point
 * cloud processing.
 *
 * It's an object and all properties are not present, but depends on
 * processing options.
 */
export function MCP_ENVIPointCloudProductsInfo() {
  return z.object({
    buildings_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the Buildings product.',
      )
      .optional(),
    building_perimeters_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the Building Perimeters product.',
      )
      .optional(),
    dem_contours_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the DEM Contours product.',
      )
      .optional(),
    dem_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the DEM product.',
      )
      .optional(),
    dem_tin_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the DEM TIN product (also known as Terrain TIN).',
      )
      .optional(),
    dsm_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the DSM product.',
      )
      .optional(),
    orthophoto_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the Orthophoto product.',
      )
      .optional(),
    pointcloud_uri: z
      .array(z.string())
      .describe(
        'An array of strings containing the fully-qualified filenames for the Point Cloud products.',
      )
      .optional(),
    powerlines_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the Power Lines product.',
      )
      .optional(),
    trees_uri: z
      .string()
      .describe(
        'A string containing the fully-qualified filename for the Trees product.',
      )
      .optional(),
  });
}
