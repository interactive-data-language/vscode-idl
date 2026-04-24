import { QueryDatasetWithENVI } from '@idl/mcp/envi';
import {
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Query a dataset with ENVI (VS Code wrapper)
 */
export async function RunMCPTool_QueryDatasetWithENVI(
  id: string,
  params: MCPToolParams<MCPTool_QueryDatasetWithENVI>,
): Promise<MCPToolResponse<MCPTool_QueryDatasetWithENVI>> {
  return QueryDatasetWithENVI(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
