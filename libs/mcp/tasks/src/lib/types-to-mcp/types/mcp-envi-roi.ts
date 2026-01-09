import { z } from 'zod';

/**
 * Returns an ENVI ROI task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIROI(description: string) {
  return z
    .object({
      factory: z
        .literal('URLROI')
        .describe('This value should always be "URLROI"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to an ENVI ROI file. Should end with an ".xml" extension.`
        ),
    })
    .describe(description);
}
