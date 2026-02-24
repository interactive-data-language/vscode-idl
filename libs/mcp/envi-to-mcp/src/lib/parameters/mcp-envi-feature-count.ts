import { z } from 'zod';

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
