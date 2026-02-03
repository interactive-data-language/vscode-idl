import { z } from 'zod';

/**
 * Creates an ENVI secure string
 */
export function MCP_ENVISecureString() {
  return z.string();
}
