import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIRaster(description: string) {
  return z
    .object({
      factory: z
        .literal('URLRaster')
        .describe('This value should always be "URLRaster"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the dataset on disk.\n\nFor complex file formats, this should likely be the metadata file itself and not individual image files which ENVI supports.\n\nSee the documentation for what files should be the primary URL https://www.nv5geospatialsoftware.com/docs/SupportedFormats.html.`
        ),
      auxiliary_url: z
        .array(z.string())
        .describe(
          'If a file has any auxiliary files, specify them here. For an ENVI formatted file (.dat, .img, .hsi) this would be a single element with the path to the .hdr file. Only specify auxiliary files if they exist.'
        )
        .optional(),
      dataset_index: z
        .number()
        .describe(
          'If a raster has more than one dataset present, optionally specify the zero-based index of which image to open. Applicable to file types like NITF, Sentinel 2, or similar where multi-resolutions or images are present in a single file.'
        )
        .optional(),
    })
    .describe(description);
}
