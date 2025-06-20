import { z } from 'zod';

/**
 * Returns an ENVI ROI task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVISpectralLibrary(description: string) {
  return z.object({
    factory: z
      .literal('URLSpectralLibrary')
      .describe('This value should always be "URLSpectralLibrary"'),
    url: z
      .string()
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk. This should be a file with a ".xml" file extension`
      ),
    auxiliary_url: z
      .string()
      .describe(
        'Specify the header file for the spectral library (.hdr extension). This should exist and contains metadata about the library itself.'
      ),
  });
}
