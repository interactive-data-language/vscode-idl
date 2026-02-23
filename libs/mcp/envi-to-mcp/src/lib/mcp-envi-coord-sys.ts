import { z } from 'zod';

/**
 * Returns an ENVI Coord Sys task parameter for an ENVI Task MCP
 * Tool
 *
 * Tweaked so it only works with coordinate system codes and not projection
 * strings, but we can add or tweak that later if needed
 */
export function MCP_ENVICoordSys() {
  return z.object({
    factory: z.literal('CoordSys'),
    coord_sys_code: z
      .string()
      .describe(`The EPSG code for the coordinate system`),
  });
}
