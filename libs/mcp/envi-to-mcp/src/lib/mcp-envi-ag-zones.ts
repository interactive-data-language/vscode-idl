import { z } from 'zod';

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
        `Provide a fully-qualified filepath to the az zones on disk. Should end with a ".sav" extension.`
      ),
  });
}
