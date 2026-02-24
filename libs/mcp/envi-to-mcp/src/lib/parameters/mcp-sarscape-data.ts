import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['envisarscapedata'] = 'ENVISARscapedata';

/**
 * Returns an MCP SARscapeData task parameter
 */
export function MCP_SARscapeData() {
  return z.object({
    factory: z.literal('ENVISARscapedata'),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the dataset on disk.\n\nExample files include imported data (i.e. _slc.sml) or original files (manifest.safe, *.h5, *.xml, *.n1, *.e1, *.e2, IMG*, SICD as .ntf)`
      ),
  });
}
