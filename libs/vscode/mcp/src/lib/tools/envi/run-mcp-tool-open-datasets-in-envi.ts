import { OpenDatasetsInENVI } from '@idl/mcp/envi';
import {
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Open a dataset in ENVI (VS Code wrapper)
 */
export async function RunMCPTool_OpenDatasetsInENVI(
  id: string,
  params: MCPToolParams<MCPTool_OpenDatasetsInENVI>,
): Promise<MCPToolResponse<MCPTool_OpenDatasetsInENVI>> {
  return OpenDatasetsInENVI(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
