import { Sleep } from '@idl/shared/extension';
import {
  MCPToolHTTPResponse,
  MCPToolParams,
  MCPToolParams_ParameterOverride,
  MCPTools,
  MCPTools_ParameterOverride,
} from '@idl/types/mcp';

import { DEBUG_PAUSE } from '../../debugging/_shared.interface';
import { CREATED_CLIENT, MCP_CLIENT } from './create-mcp-client';

/**
 * Calls an MCP tool via HTTP and returns the response
 *
 * Manually waits for our DEBUG_PAUSE constant after the
 * tool finished running to let objects catch up and
 * synchronize with the main VSCode window
 */
export async function CallMCPTool<T extends MCPTools>(
  tool: T,
  params: T extends MCPTools_ParameterOverride
    ? MCPToolParams_ParameterOverride<T>
    : MCPToolParams<T>,
) {
  // make sure we have connected
  if (!CREATED_CLIENT) {
    throw new Error('Must create MCP client before running a tool');
  }

  // call tool and strictly type
  const result = await (MCP_CLIENT.callTool({
    name: tool,
    arguments: params as any,
  }) as Promise<MCPToolHTTPResponse<T>>);

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // return result
  return result;
}
