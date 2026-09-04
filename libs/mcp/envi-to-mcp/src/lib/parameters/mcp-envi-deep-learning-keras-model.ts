import { z } from 'zod';

import { ENVI_FILE_EXTENSION_LOOKUP } from '../envi-file-extension.interface';
import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['deeplearningkerasmodel'] = 'DeepLearningKerasModel';

ENVI_FILE_EXTENSION_LOOKUP['deeplearningkerasmodel'] = '.h5';

/**
 * Returns an ENVI Deep Learning Keras Model parameter
 *
 * This is used because we still return some H5 models
 */
export function MCP_ENVIDeepLearningKerasModel() {
  return z.object({
    factory: z.literal('DeepLearningKerasModel'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.h5'), {
        message: 'url must end with ".h5"',
      })
      .describe(
        `Provide a fully-qualified filepath to the ENVI Keras model on disk. This should be a file with a ".h5" file extension.`,
      ),
  });
}
