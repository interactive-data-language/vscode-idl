import { StartENVI } from '@idl/mcp/envi';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Start ENVI (VS Code wrapper)
 */
export async function RunMCPTool_StartENVI(
  id: string,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  return StartENVI(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
