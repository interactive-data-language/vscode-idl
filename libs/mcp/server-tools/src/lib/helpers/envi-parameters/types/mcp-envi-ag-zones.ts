import { z } from 'zod';

/**
 * Returns an ENVI Ag Zones MCP parameter
 */
export function MCPENVIAgZones(description: string) {
  return z.object({
    factory: z
      .literal('ENVIAgZones')
      .describe('This value should always be "ENVIAgZones"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk. Should end with a .sav extension.`
      ),
  });
}
