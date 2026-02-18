import { MCPToolParams, MCPTools } from '@idl/types/mcp';

/** Message to track history for running MCP Tools */
export type MCPHistory_Message = 'mcp-history';

/**
 * Payloads for tracking MCP tool history
 */
export type MCPHistory_MessagePayload<T extends MCPTools> = {
  /** ID of the tool run */
  id: string;
  /** Tool we are running */
  tool: T;
  /** Parameters for running the tool */
  params: MCPToolParams<T>;
};
