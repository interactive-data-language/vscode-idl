import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIRaster() {
  return z.object({
    factory: z.literal('URLRaster'),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the dataset on disk.\n\nCommon extensions to use: .dat, .img, .hsi, .tif, .nitf, .ntf. For complex file formats, this should likely be the metadata file itself and not individual image files which ENVI supports.\n\nSee the documentation for what files should be the primary URL https://www.nv5geospatialsoftware.com/docs/SupportedFormats.html.`
      ),
    auxiliary_url: z
      .array(z.string())
      .describe(
        'If a file has any auxiliary files, specify them here. This would include files with the same base name as the url and extensions such as .enp or .hdr file. Auxiliary files MUST be included if they exist. ALWAYS check for header files.'
      )
      .optional(),
    dataset_index: z
      .number()
      .describe(
        'If a raster has more than one dataset present, optionally specify the zero-based index of which image to open. Applicable to file types like NITF, Sentinel 2, or similar where multi-resolutions or images are present in a single file.'
      )
      .optional(),
  });
}
