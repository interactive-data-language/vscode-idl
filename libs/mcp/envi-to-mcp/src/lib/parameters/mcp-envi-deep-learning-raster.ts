import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['deeplearningraster'] = 'DeepLearningRaster';

/**
 * Returns an ENVI Deep Learning Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIDeepLearningRaster() {
  return z.object({
    factory: z.literal('DeepLearningRaster'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.dat'), {
        message: 'url must end with ".dat"',
      })
      .describe(
        `Provide a fully-qualified filepath to the dataset on disk. This will always be an ENVI formatted file and should have a ".dat" file extension.`
      ),
    auxiliary_url: z
      .array(z.string())
      .describe(
        'If a file has any auxiliary files, specify them here. This would include files with the same base name as the url and extensions such as .enp or .hdr file. Auxiliary files MUST be included if they exist. ALWAYS check for header files.'
      )
      .optional(),
  });
}
