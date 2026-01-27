import { z } from 'zod';

/**
 * Returns an MCP SARscapeData task parameter
 */
export function MCP_SARscapeData(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('ENVISARscapedata')
        .refine((val) => val.toLowerCase() === 'envisarscapedata', {
          message: 'factory must be "ENVISARscapedata" (case-insensitive)',
        })
        .describe('This value should be "ENVISARscapedata" (case-insensitive)'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the dataset on disk.\n\nExample files include imported data (i.e. _slc.sml) or original files (manifest.safe, *.h5, *.xml, *.n1, *.e1, *.e2, IMG*, SICD as .ntf)`
        ),
    })
    .describe(description);
}
