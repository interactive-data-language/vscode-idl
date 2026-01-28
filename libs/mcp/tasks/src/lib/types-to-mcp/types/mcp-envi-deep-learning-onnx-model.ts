import { z } from 'zod';

/**
 * Returns an ENVI Deep Learning ONNX Model parameter
 */
export function MCP_ENVIDeepLearningONNXModel(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('DeepLearningONNXModel')
        .refine((val) => val.toLowerCase() === 'deeplearningonnxmodel', {
          message: 'factory must be "DeepLearningONNXModel" (case-insensitive)',
        })
        .describe(
          'This value should be "DeepLearningONNXModel" (case-insensitive)'
        ),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the ENVI ONNX model on disk. This should be a file with a ".envi.onnx" file extension. The ".envi.onnx" comes from the model being configured to run in ENVI (needs to happen if not ".envi.onnx"). To verify that the ONNX model is compatible with data, use the ENVI Query Dataset tool to check the model before use.`
        ),
    })
    .describe(description);
}
