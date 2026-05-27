import { ListENVIToolWorkflows } from '@idl/mcp/envi';
import {
  MCPTool_ListENVIToolWorkflows,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Return known workflows from ENVI (VS Code wrapper)
 */
export async function RunMCPTool_ListENVIToolWorkflows(
  id: string,
  params: MCPToolParams<MCPTool_ListENVIToolWorkflows>,
): Promise<MCPToolResponse<MCPTool_ListENVIToolWorkflows>> {
  return ListENVIToolWorkflows(MCP_EXECUTION_BACKEND, params);
}
