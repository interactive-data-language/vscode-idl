import { z } from 'zod';

/**
 * Returns an ENVI Point Cloud Spatial Ref task parameter for an
 * ENVI Task MCP Tool
 *
 * Tweaked so it only works with coordinate system codes and not projection
 * strings, but we can add or tweak that later if needed
 */
export function MCP_ENVIPointCloudSpatialRef(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('PointCloudSpatialRef')
        .refine((val) => val.toLowerCase() === 'pointcloudspatialref', {
          message: 'factory must be "PointCloudSpatialRef" (case-insensitive)',
        })
        .describe(
          'This value should be "PointCloudSpatialRef" (case-insensitive)'
        ),
      coord_sys_code: z
        .string()
        .describe(`The EPSG code for the coordinate system`),
      geocentric: z
        .boolean()
        .optional()
        .describe(
          'A boolean value that specifies if the coordinate system is Geocentric.'
        ),
    })
    .describe(description);
}
