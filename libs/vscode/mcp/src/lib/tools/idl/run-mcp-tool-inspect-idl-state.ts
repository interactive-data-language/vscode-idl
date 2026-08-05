import { InspectIDLState } from '@idl/mcp/idl';
import {
  IIDLMCPExecutionBackend,
  MCPTool_InspectIDLState,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

// VS Code wrapper for the inspect-idl-state MCP tool
export async function RunMCPTool_InspectIDLState(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_InspectIDLState>,
): Promise<MCPToolResponse<MCPTool_InspectIDLState>> {
  return InspectIDLState(backend, params);
}
