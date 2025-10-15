import { MCPToolParams, MCPToolResponse, MCPTools } from '@idl/types/mcp';

/** Message to execute an MCP action through our language server (server to client) */
export type MCP_LSP_Message = 'mcp';

/**
 * Payloads when we send messages from the server to the client
 */
export type MCP_LSP_MessagePayload<T extends MCPTools> = {
  /** ID of the tool run */
  id: string;
  /** Tool we are running */
  tool: T;
  /** Parameters for running the tool */
  params: MCPToolParams<T>;
};

/**
 * Payloads when we send messages from the server to the client
 */
export type MCP_LSP_MessageResponse<T extends MCPTools> = MCPToolResponse<T>;
