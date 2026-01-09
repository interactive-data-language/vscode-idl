import { z } from 'zod';

/**
 * Returns an ENVI Raster Series task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIRasterSeries(description: string) {
  return z
    .object({
      factory: z
        .literal('URLRasterSeries')
        .describe('This value should always be "URLRasterSeries"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to raster series on disk. Should end with a ".series" extension.`
        ),
    })
    .describe(description);
}
