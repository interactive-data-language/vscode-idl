import { z } from 'zod';

import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['urlspectrallibrary'] = 'URLSpectralLibrary';

/**
 * Returns an ENVI ROI task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVISpectralLibrary() {
  return z.object({
    factory: z.literal('URLSpectralLibrary'),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the spectral library. Should end with an ".sli" extension.`,
      ),
    auxiliary_url: z
      .string()
      .describe(
        'Specify the header file for the spectral library (.hdr extension). This should exist and contains metadata about the library itself.',
      ),
  });
}
