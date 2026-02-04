import { MCPTools } from './mcp-tools.interface';

/**
 * Callback triggered when we call an MCP tool
 *
 * Global hook for logging, use tracking, or extending/customizing tool usage
 */
export type MCPToolInvokedCallback<T extends MCPTools> = (
  tool: T
) => Promise<void> | void;
