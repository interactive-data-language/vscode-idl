import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';
import { MCP_ENVICoordSys } from './mcp-envi-coord-sys';

FACTORY_LOOKUP['griddefinition'] = 'GridDefinition';

/**
 * Returns an ENVI Grid Definition as an MCP parameter
 */
export function MCP_ENVIGridDefinition() {
  return z.union([
    z.object({
      factory: z.literal('GridDefinition'),
      coord_sys: MCP_ENVICoordSys().describe(
        'Coordinate system for the grid definition'
      ),
      extents: z
        .array(z.number())
        .length(4)
        .describe(
          'Specify the geographic extent of the grid as follows [xmin, ymax, xmax, ymin], where x and y are map coordinates (x=eastings, y=northings) or geographic coordinates (x=longitude, y=latitude), depending on the ENVICoordSys object. The coordinates must be in the same units (degrees, meters, feet, etc.) as the associated ENVICoordSys object. If you set this property, you must also specify (1) pixel_size or (2) nrows and ncolumns.'
        ),
      pixel_size: z
        .array(z.number())
        .length(2)
        .optional()
        .describe(
          'Specify a two-element array with the [x,y] pixel size in the same units as the associated ENVICoordSys object.'
        ),
      ncolumns: z
        .number()
        .optional()
        .describe('The number of columns in the grid definition'),
      nrows: z
        .number()
        .optional()
        .describe('The number of rows in the grid definition'),
    }),
    z.object({
      factory: z.literal('GridDefinition'),
      coord_sys: MCP_ENVICoordSys().describe(
        'Coordinate system for the grid definition'
      ),
      tie_point_map: z
        .array(z.number())
        .length(2)
        .describe(
          'Specify a two-element array with the map coordinates of the tie_point_pixel location, as follows: [xmin, ymax]. The coordinates must be in the same units (degrees, meters, feet, etc.) as the associated ENVICoordSys object.'
        ),
      tie_point_pixel: z
        .array(z.number())
        .length(2)
        .default([0, 0])
        .optional()
        .describe(
          'Specify a two-element array with the pixel coordinates of the tie point. If you set this property, you must also specify tie_point_map, nrows, ncolumns, and pixel_size.'
        ),
      pixel_size: z
        .array(z.number())
        .length(2)
        .describe(
          'Specify a two-element array with the [x,y] pixel size in the same units as the associated ENVICoordSys object.'
        ),
      ncolumns: z
        .number()
        .describe('The number of columns in the grid definition'),
      nrows: z.number().describe('The number of rows in the grid definition'),
    }),
  ]);
}
