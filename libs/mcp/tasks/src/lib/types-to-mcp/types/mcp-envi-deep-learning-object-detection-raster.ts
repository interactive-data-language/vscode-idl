import { z } from 'zod';

/**
 * Returns an ENVI Deep Learning Object Detection Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIDeepLearningObjectDetectionRaster(description: string) {
  return z
    .object({
      factory: z
        .literal('DeepLearningObjectDetectionRaster')
        .describe(
          'This value should always be "DeepLearningObjectDetectionRaster"'
        ),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the dataset on disk. This will always be an ENVI formatted file and should have a ".dat" file extension.`
        ),
      auxiliary_url: z
        .array(z.string())
        .describe(
          'If a file has any auxiliary files, specify them here. This would include files with the same base name as the url and extensions such as .enp or .hdr file. Auxiliary files MUST be included if they exist. ALWAYS check for header files.'
        )
        .optional(),
    })
    .describe(description);
}
