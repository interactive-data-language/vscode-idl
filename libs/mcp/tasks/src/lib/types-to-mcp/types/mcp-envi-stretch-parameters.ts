import { z } from 'zod';

/**
 * Returns an ENVI stretch parameters object for an ENVI Task MCP Tool
 */
export function MCP_ENVIStretchParameters() {
  return z.object({
    factory: z
      .string()
      .default('StretchParameters')
      .refine((val) => val.toLowerCase() === 'stretchparameters', {
        message: 'factory must be "StretchParameters" (case-insensitive)',
      })
      .describe('This value should be "StretchParameters" (case-insensitive)'),
    stretchType: z
      .enum([
        'Linear',
        'Equalization',
        'Gaussian',
        'Logarithmic',
        // 'Optimized Linear',
        'Square Root',
      ])
      .describe(`Specify a string with the stretch type.`),
    minValue: z
      .number()
      .optional()
      .default(Number.NaN)
      .describe(
        'Specify a double-precision floating point value indicating the minimum pixel value for the specified stretch.'
      ),
    maxValue: z
      .number()
      .optional()
      .default(Number.NaN)
      .describe(
        'Specify a double-precision floating point value indicating the maximum pixel value for the specified stretch.'
      ),
    minPercent: z
      .number()
      .default(1)
      .describe(
        'Specify a value from 0 to 100 indicating the maximum percentage of the histogram to include in the specified stretch.'
      ),
    maxPercent: z
      .number()
      .default(99)
      .describe(
        'Specify a double-precision floating point value indicating the maximum pixel value for the specified stretch.'
      ),
  });
}
