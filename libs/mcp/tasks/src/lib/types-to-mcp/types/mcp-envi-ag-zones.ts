import { z } from 'zod';

/**
 * Returns an ENVI Ag Zones MCP parameter
 */
export function MCP_ENVIAgZones(description: string) {
  return z
    .object({
      factory: z
        .literal('ENVIAgZones')
        .describe('This value should always be "ENVIAgZones"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the az zones on disk. Should end with a ".sav" extension.`
        ),
    })
    .describe(description);
}
