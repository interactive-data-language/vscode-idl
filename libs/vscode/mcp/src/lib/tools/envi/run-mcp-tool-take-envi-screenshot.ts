import { TakeENVIScreenshot } from '@idl/mcp/envi';
import {
  MCPTool_TakeENVIScreenshot,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Take a screenshot of the ENVI display (VS Code wrapper)
 */
export async function RunMCPTool_TakeENVIScreenshot(
  id: string,
  params: MCPToolParams<MCPTool_TakeENVIScreenshot>,
): Promise<MCPToolResponse<MCPTool_TakeENVIScreenshot>> {
  return TakeENVIScreenshot(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
