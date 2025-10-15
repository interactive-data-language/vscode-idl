import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIRaster(description: string) {
  return z.object({
    factory: z
      .literal('URLRaster')
      .describe('This value should always be "URLRaster"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk.`
      ),
    auxiliary_url: z
      .array(z.string())
      .describe(
        'If a file has any auxiliary files, specify them here. For an ENVI formatted file (.dat, .img, .hsi) this would be a single element with the path to the .hdr file. Only specify auxiliary files if they exist.'
      )
      .optional(),
  });
}
