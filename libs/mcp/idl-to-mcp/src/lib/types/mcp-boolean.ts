import { z } from 'zod';

/**
 * Creates an MCP boolean parameter
 */
export function MCP_Boolean() {
  return z.boolean();
}
