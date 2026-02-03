import { z } from 'zod';

/**
 * Creates an spectral index data type
 */
export function MCP_ENVISpectralIndex() {
  return z.string();
}
