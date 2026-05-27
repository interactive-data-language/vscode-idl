import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['enviannotationset'] = 'ENVIAnnotationSet';

/**
 * Returns an ENVI Annotation Set MCP parameter
 */
export function MCP_ENVIAnnotationSet() {
  return z.object({
    factory: z.literal('URLAnnotationSet'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.anz'), {
        message: 'url must end with ".anz"',
      })
      .describe(
        `Provide a fully-qualified filepath to the annotation set on disk. Should end with an ".anz" extension.`,
      ),
  });
}
