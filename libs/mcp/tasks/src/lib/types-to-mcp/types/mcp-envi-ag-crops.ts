import { z } from 'zod';

/**
 * Returns an ENVI Ag Crops MCP parameter
 */
export function MCP_ENVIAgCrops() {
  return z.object({
    factory: z
      .string()
      .default('ENVIAgCrops')
      .refine((val) => val.toLowerCase() === 'enviagcrops', {
        message: 'factory must be "ENVIAgCrops" (case-insensitive)',
      })
      .describe('This value should be "ENVIAgCrops" (case-insensitive)'),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the ag crops on disk. Should end with a ".json" extension.`
      ),
  });
}
