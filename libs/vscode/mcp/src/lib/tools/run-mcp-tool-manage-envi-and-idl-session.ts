import { ManageENVIAndIDLSession } from '@idl/mcp/idl';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { VSCodeSendMCPNotification } from '../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../initialize-mcp-vscode';

/**
 * Manages ENVI and IDL session (VS Code wrapper)
 */
export async function RunMCPTool_ManageENVIAndIDLSession(
  id: string,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  return ManageENVIAndIDLSession(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
