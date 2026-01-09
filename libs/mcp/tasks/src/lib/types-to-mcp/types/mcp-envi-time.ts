import { z } from 'zod';

/**
 * Returns an ENVI Time object for an MCP parameter
 */
export function MCP_ENVITime(description: string) {
  return z
    .object({
      factory: z.literal('Time').describe('This value should always be "Time"'),
      acquisition: z
        .string()
        .describe(
          `Specify a string with the acquisition time, conforming to the ISO-8601 standard. The string can be in any of the following formats:\n- YYYY-MM-DD\n- YYYY-MM-DDTHH:MM:SS.DZ\n- YYYY-MM-DDTHH:MM:SS:Dooo:mm`
        ),
    })
    .describe(description);
}
