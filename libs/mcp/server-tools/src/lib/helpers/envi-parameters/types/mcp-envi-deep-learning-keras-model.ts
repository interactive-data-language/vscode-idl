import { z } from 'zod';

/**
 * Returns an ENVI Deep Learning ONNX Keras parameter
 *
 * This is used because we still return some H5 models
 */
export function MCPENVIDeepLearningKerasModel(description: string) {
  return z
    .object({
      factory: z
        .literal('DeepLearningKerasModel')
        .describe('This value should always be "DeepLearningKerasModel"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the ENVI Keras model on disk. This should be a file with a ".h5" file extension.`
        ),
    })
    .describe(description);
}
