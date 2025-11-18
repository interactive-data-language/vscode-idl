import { z } from 'zod';

/**
 * Returns an ENVI Ag Crops MCP parameter
 */
export function MCPENVIAgCrops(description: string) {
  return z
    .object({
      factory: z
        .literal('ENVIAgCrops')
        .describe('This value should always be "ENVIAgCrops"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the az crops on disk. Should end with a ".json" extension.`
        ),
    })
    .describe(description);
}
