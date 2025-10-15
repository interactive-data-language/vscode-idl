import { z } from 'zod';

/**
 * Returns an ENVI Machine Learning Model parameter
 */
export function ENVIMachineLearningModel(description: string) {
  return z.object({
    factory: z
      .literal('MachineLearningModel')
      .describe('This value should always be "MachineLearningModel"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk. This should be a file with a ".json" file extension`
      ),
  });
}
