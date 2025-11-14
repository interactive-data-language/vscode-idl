import { z } from 'zod';

/**
 * Returns an ENVI Deep Learning ONNX Model parameter
 */
export function MCPENVIDeepLearningONNXModel(description: string) {
  return z
    .object({
      factory: z
        .literal('DeepLearningONNXModel')
        .describe('This value should always be "DeepLearningONNXModel"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the ENVI ONNX model on disk. This should be a file with a ".envi.onnx" file extension. The ".envi.onnx" comes from the model being configured to run in ENVI (needs to happen if not ".envi.onnx"). To verify that the ONNX model is compatible with data, use the ENVI Query Dataset tool to cehck model and image data before use.`
        ),
    })
    .describe(description);
}
