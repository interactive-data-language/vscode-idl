import { z } from 'zod';

import { ENVI_FILE_EXTENSION_LOOKUP } from '../envi-file-extension.interface';
import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['enviagcrops'] = 'ENVIAgCrops';

ENVI_FILE_EXTENSION_LOOKUP['enviagcrops'] = '.json';

/**
 * Returns an ENVI Ag Crops MCP parameter
 */
export function MCP_ENVIAgCrops() {
  return z.object({
    factory: z.literal('ENVIAgCrops'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.json'), {
        message: 'url must end with ".json"',
      })
      .describe(
        `Provide a fully-qualified filepath to the ag crops on disk. Should end with a ".json" extension.`,
      ),
  });
}
