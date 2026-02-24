import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['featurecount'] = 'FeatureCount';
/**
 * Returns an ENVI Feature Count MCP parameter
 */
export function MCP_ENVIFeatureCount() {
  return z.object({
    factory: z.literal('FeatureCount'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.efc'), {
        message: 'url must end with ".efc"',
      })
      .describe(
        `Provide a fully-qualified filepath to the feature count file disk. Should end with a ".efc" extension.`
      ),
  });
}
