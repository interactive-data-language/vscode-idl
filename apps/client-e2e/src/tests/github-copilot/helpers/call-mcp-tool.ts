import { MCPToolParams, MCPTools } from '@idl/types/mcp';

import { CREATED_CLIENT, MCP_CLIENT } from './create-mcp-client';

/**
 * Calls an MCP tool and returns the response
 */
export function CallMCPTool<T extends MCPTools>(
  tool: T,
  params: MCPToolParams<T>
) {
  // make sure we have connected
  if (!CREATED_CLIENT) {
    throw new Error('Must create MCP client before running a tool');
  }

  // call tool and strictly type
  return MCP_CLIENT.callTool({
    name: tool,
    arguments: params as any,
  });
}
