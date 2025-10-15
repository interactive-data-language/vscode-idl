import { z } from 'zod';

/**
 * Returns an ENVI ROI task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIROI(description: string) {
  return z.object({
    factory: z
      .literal('URLROI')
      .describe('This value should always be "URLROI"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk. This should be a file with a ".xml" file extension`
      ),
  });
}
