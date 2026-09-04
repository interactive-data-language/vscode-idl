import { z } from 'zod';

import { ENVI_FILE_EXTENSION_LOOKUP } from '../envi-file-extension.interface';
import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['urlgcpset'] = 'URLGCPSet';

ENVI_FILE_EXTENSION_LOOKUP['urlgcpset'] = '.pts';

/**
 * Returns an ENVI GCP Set MCP parameter
 */
export function MCP_ENVIGCPSet() {
  return z.object({
    factory: z.literal('URLGCPSet'),
    url: z
      .string()
      .refine((val) => val.toLowerCase().endsWith('.pts'), {
        message: 'url must end with ".pts"',
      })
      .describe(
        `Provide a fully-qualified filepath to the GCP (Ground Control Points) file on disk. Should end with a ".pts" extension.`,
      ),
  });
}
