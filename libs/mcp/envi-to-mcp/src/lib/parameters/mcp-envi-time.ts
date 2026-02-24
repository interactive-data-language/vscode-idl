import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['time'] = 'Time';

/**
 * Returns an ENVI Time object for an MCP parameter
 */
export function MCP_ENVITime() {
  return z.object({
    factory: z.literal('Time'),
    acquisition: z
      .string()
      .describe(
        `Specify a string with the acquisition time, conforming to the ISO-8601 standard. The string can be in any of the following formats:\n- YYYY-MM-DD\n- YYYY-MM-DDTHH:MM:SS.DZ\n- YYYY-MM-DDTHH:MM:SS:Dooo:mm`
      ),
  });
}
