import { StartIDLSession } from '@idl/mcp/idl';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Start IDL (VS Code wrapper)
 */
export async function RunMCPTool_StartIDL(
  id: string,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  return StartIDLSession(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
