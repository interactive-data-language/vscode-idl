import { z } from 'zod';

import { ENVI_FILE_EXTENSION_LOOKUP } from '../envi-file-extension.interface';
import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['urlrasterseries'] = 'URLRasterSeries';

ENVI_FILE_EXTENSION_LOOKUP['urlrasterseries'] = '.series';

/**
 * Returns an ENVI Raster Series task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIRasterSeries() {
  return z.object({
    factory: z.literal('URLRasterSeries'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.series'), {
        message: 'url must end with ".series"',
      })
      .describe(
        `Provide a fully-qualified filepath to raster series on disk. Should end with a ".series" extension.`,
      ),
  });
}
