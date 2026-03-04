import { z } from 'zod';

/**
 * Creates an MCP object parameter (hash, orderedhash, dict)
 */
export function MCP_Object() {
  return z.record(z.any(), z.any());
}
