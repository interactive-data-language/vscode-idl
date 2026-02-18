import { z } from 'zod';

/**
 * Returns an ENVI Feature Count MCP parameter
 */
export function MCP_ENVIFeatureCount() {
  return z.object({
    factory: z
      .string()
      .default('FeatureCount')
      .refine((val) => val.toLowerCase() === 'featurecount', {
        message: 'factory must be "FeatureCount" (case-insensitive)',
      })
      .describe('This value should be "FeatureCount" (case-insensitive)'),
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
