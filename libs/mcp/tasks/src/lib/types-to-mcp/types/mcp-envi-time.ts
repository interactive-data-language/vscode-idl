import { z } from 'zod';

/**
 * Returns an ENVI Time object for an MCP parameter
 */
export function MCP_ENVITime() {
  return z.object({
    factory: z
      .string()
      .default('Time')
      .refine((val) => val.toLowerCase() === 'time', {
        message: 'factory must be "Time" (case-insensitive)',
      })
      .describe('This value should be "Time" (case-insensitive)'),
    acquisition: z
      .string()
      .describe(
        `Specify a string with the acquisition time, conforming to the ISO-8601 standard. The string can be in any of the following formats:\n- YYYY-MM-DD\n- YYYY-MM-DDTHH:MM:SS.DZ\n- YYYY-MM-DDTHH:MM:SS:Dooo:mm`
      ),
  });
}
