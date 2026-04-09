import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['deeplearningonnxmodel'] = 'DeepLearningONNXModel';

/**
 * Returns an ENVI Deep Learning ONNX Model parameter
 */
export function MCP_ENVIDeepLearningONNXModel() {
  return z.object({
    factory: z.literal('DeepLearningONNXModel'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.envi.onnx'), {
        message: 'url must end with ".envi.onnx"',
      })
      .describe(
        `Provide a fully-qualified filepath to the ENVI ONNX model on disk. This should be a file with a ".envi.onnx" file extension. The ".envi.onnx" comes from the model being configured to run in ENVI (needs to happen if not ".envi.onnx"). To verify that the ONNX model is compatible with data, use the ENVI Query Dataset tool to check the model before use.`,
      ),
  });
}
