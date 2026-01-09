import { z } from 'zod';

/**
 * Returns an ENVI Machine Learning Model parameter
 */
export function MCP_ENVIMachineLearningModel(description: string) {
  return z
    .object({
      factory: z
        .literal('MachineLearningModel')
        .describe('This value should always be "MachineLearningModel"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the ENVI Machine Learning model on disk. This should be a file with a ".json" file extension`
        ),
    })
    .describe(description);
}
