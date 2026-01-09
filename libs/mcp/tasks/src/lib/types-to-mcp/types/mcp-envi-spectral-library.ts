import { z } from 'zod';

/**
 * Returns an ENVI ROI task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVISpectralLibrary(description: string) {
  return z
    .object({
      factory: z
        .literal('URLSpectralLibrary')
        .describe('This value should always be "URLSpectralLibrary"'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to the spectral library. Should end with an ".sli" extension.`
        ),
      auxiliary_url: z
        .string()
        .describe(
          'Specify the header file for the spectral library (.hdr extension). This should exist and contains metadata about the library itself.'
        ),
    })
    .describe(description);
}
