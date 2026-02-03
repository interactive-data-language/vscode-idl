import { z } from 'zod';

/**
 * Returns an ENVI Ag Zones MCP parameter
 */
export function MCP_ENVIAgZones() {
  return z.object({
    factory: z
      .string()
      .default('ENVIAgZones')
      .refine((val) => val.toLowerCase() === 'enviagzones', {
        message: 'factory must be "ENVIAgZones" (case-insensitive)',
      })
      .describe('This value should be "ENVIAgZones" (case-insensitive)'),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the az zones on disk. Should end with a ".sav" extension.`
      ),
  });
}
