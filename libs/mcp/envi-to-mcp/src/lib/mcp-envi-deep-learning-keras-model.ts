import { z } from 'zod';

/**
 * Returns an ENVI Deep Learning Keras Model parameter
 *
 * This is used because we still return some H5 models
 */
export function MCP_ENVIDeepLearningKerasModel() {
  return z.object({
    factory: z
      .string()
      .default('DeepLearningKerasModel')
      .refine((val) => val.toLowerCase() === 'deeplearningkerasmodel', {
        message: 'factory must be "DeepLearningKerasModel" (case-insensitive)',
      })
      .describe(
        'This value should be "DeepLearningKerasModel" (case-insensitive)'
      ),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.h5'), {
        message: 'url must end with ".h5"',
      })
      .describe(
        `Provide a fully-qualified filepath to the ENVI Keras model on disk. This should be a file with a ".h5" file extension.`
      ),
  });
}
