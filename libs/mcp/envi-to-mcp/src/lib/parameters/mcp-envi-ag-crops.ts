import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['enviagcrops'] = 'ENVIAgCrops';

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
        `Provide a fully-qualified filepath to the ag crops on disk. Should end with a ".json" extension.`
      ),
  });
}
