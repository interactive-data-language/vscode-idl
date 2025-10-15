import { z } from 'zod';

/**
 * Returns an ENVI Coord Sys task parameter for an ENVI Task MCP
 * Tool
 *
 * Tweaked so it only works with coordinate system codes and not projection
 * strings, but we can add or tweak that later if needed
 */
export function MCPENVICoordSys(description: string) {
  return z
    .object({
      factory: z
        .literal('CoordSys')
        .describe('This value should always be "CoordSys"'),
      coord_sys_code: z
        .string()
        .describe(`The EPSG code for the coordinate system`),
    })
    .describe(description);
}
