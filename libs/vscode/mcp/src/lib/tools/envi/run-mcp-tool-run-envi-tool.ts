import { RunENVITool } from '@idl/mcp/envi';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITool,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Run a tool in ENVI (VS Code wrapper)
 */
export async function RunMCPTool_RunENVITool(
  id: string,
  params: MCPToolParams<MCPTool_RunENVITool>,
): Promise<MCPToolResponse<MCPTool_RunENVITool>> {
  // track high-level task called - only do this for core ENVI tools
  if (!params.uri) {
    VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
      idl_command: `idl.mcp.${MCP_TOOL_LOOKUP.RUN_ENVI_TOOL}.${params.toolName}`,
    });
  }

  return RunENVITool(MCP_EXECUTION_BACKEND, params, (msg) =>
    VSCodeSendMCPNotification(id, { message: msg }),
  );
}
