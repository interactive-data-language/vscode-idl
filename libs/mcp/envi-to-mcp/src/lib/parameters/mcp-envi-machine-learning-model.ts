import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['machinelearningmodel'] = 'MachineLearningModel';

/**
 * Returns an ENVI Machine Learning Model parameter
 */
export function MCP_ENVIMachineLearningModel() {
  return z.object({
    factory: z.literal('MachineLearningModel'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.json'), {
        message: 'url must end with ".json"',
      })
      .describe(
        `Provide a fully-qualified filepath to the ENVI Machine Learning model on disk. This should be a file with a ".json" file extension`,
      ),
  });
}
