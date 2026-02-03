import { z } from 'zod';

/**
 * Creates an ENVI URI
 */
export function MCP_ENVIURI() {
  return z.string().default('!');
}
