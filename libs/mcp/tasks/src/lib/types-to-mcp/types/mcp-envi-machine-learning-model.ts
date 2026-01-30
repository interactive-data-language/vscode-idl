import { z } from 'zod';

/**
 * Returns an ENVI Machine Learning Model parameter
 */
export function MCP_ENVIMachineLearningModel() {
  return z.object({
    factory: z
      .string()
      .default('MachineLearningModel')
      .refine((val) => val.toLowerCase() === 'machinelearningmodel', {
        message: 'factory must be "MachineLearningModel" (case-insensitive)',
      })
      .describe(
        'This value should be "MachineLearningModel" (case-insensitive)'
      ),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the ENVI Machine Learning model on disk. This should be a file with a ".json" file extension`
      ),
  });
}
