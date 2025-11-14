import { z } from 'zod';

/**
 * Returns an MCP SARscapeData task parameter
 */
export function MCPSARscapeData(description: string) {
  return z
    .object({
      factory: z
        .literal('ENVISARscapedata')
        .describe('This value should always be "ENVISARscapedata"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the dataset on disk.\n\nExample files include imported data (i.e. _slc.sml) or original files (manifest.safe, *.h5, *.xml, *.n1, *.e1, *.e2, IMG*, SICD as .ntf)`
        ),
    })
    .describe(description);
}
