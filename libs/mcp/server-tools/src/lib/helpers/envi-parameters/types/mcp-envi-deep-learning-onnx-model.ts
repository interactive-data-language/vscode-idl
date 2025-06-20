import { z } from 'zod';

/**
 * Returns an ENVI Deep Learning ONNX Model parameter
 */
export function MCPENVIDeepLearningONNXModel(description: string) {
  return z.object({
    factory: z
      .literal('DeepLearningONNXModel')
      .describe('This value should always be "DeepLearningONNXModel"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk. This should be a file with a ".envi.onnx" file extension`
      ),
  });
}
