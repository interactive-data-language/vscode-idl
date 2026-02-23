import { z } from 'zod';

/**
 * Returns an ENVI Raster Series task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIRasterSeries() {
  return z.object({
    factory: z.literal('URLRasterSeries'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.series'), {
        message: 'url must end with ".series"',
      })
      .describe(
        `Provide a fully-qualified filepath to raster series on disk. Should end with a ".series" extension.`
      ),
  });
}
