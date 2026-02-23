import { z } from 'zod';

/**
 * Returns an ENVI Point Cloud Spatial Ref task parameter for an
 * ENVI Task MCP Tool
 *
 * Tweaked so it only works with coordinate system codes and not projection
 * strings, but we can add or tweak that later if needed
 */
export function MCP_ENVIPointCloudSpatialRef() {
  return z.object({
    factory: z.literal('PointCloudSpatialRef'),
    coord_sys_code: z
      .string()
      .describe(`The EPSG code for the coordinate system`),
    geocentric: z
      .boolean()
      .optional()
      .describe(
        'A boolean value that specifies if the coordinate system is Geocentric.'
      ),
  });
}
