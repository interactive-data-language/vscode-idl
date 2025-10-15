import { IMCPToolProgress } from '@idl/types/mcp';

/** Message to execute an MCP action through our language server (server to client) */
export type MCPProgress_LSP_Message = 'mcp-progress';

/**
 * Payloads when we send messages from the server to the client
 */
export type MCPProgress_LSP_MessagePayload = {
  /** ID of the tool that has a progress update */
  id: string;
  /** Progress message */
  progress: IMCPToolProgress;
};
