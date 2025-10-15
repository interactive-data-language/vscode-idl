import { z } from 'zod';

/**
 * Returns an ENVI Raster Series task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIRasterSeries(description: string) {
  return z.object({
    factory: z
      .literal('URLRasterSeries')
      .describe('This value should always be "URLRasterSeries"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk. This should be a file with a ".series" file extension`
      ),
  });
}
