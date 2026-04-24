import { ReturnNotes } from '@idl/mcp/envi';
import {
  MCPTool_ReturnNotes,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { MCP_EXECUTION_BACKEND } from '../initialize-mcp-vscode';

/**
 * Return notes from IDL and ENVI (VS Code wrapper)
 */
export async function RunMCPTool_ReturnNotes(
  id: string,
  params: MCPToolParams<MCPTool_ReturnNotes>,
): Promise<MCPToolResponse<MCPTool_ReturnNotes>> {
  return ReturnNotes(MCP_EXECUTION_BACKEND, params);
}
