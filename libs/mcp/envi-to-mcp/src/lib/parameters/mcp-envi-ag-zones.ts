import { z } from 'zod';

import { ENVI_FILE_EXTENSION_LOOKUP } from '../envi-file-extension.interface';
import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['enviagzones'] = 'ENVIAgZones';

ENVI_FILE_EXTENSION_LOOKUP['enviagzones'] = '.sav';

/**
 * Returns an ENVI Ag Zones MCP parameter
 */
export function MCP_ENVIAgZones() {
  return z.object({
    factory: z.literal('ENVIAgZones'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.sav'), {
        message: 'url must end with ".sav"',
      })
      .describe(
        `Provide a fully-qualified filepath to the az zones on disk. Should end with a ".sav" extension.`,
      ),
  });
}
