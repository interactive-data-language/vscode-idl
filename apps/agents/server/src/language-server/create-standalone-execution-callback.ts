import {
  ListENVIToolWorkflows,
  OpenDatasetsInENVI,
  QueryDatasetWithENVI,
  ReturnNotes,
  RunENVITool,
} from '@idl/mcp/envi';
import {
  CreateIDLNotebook,
  ExecuteIDLCode,
  ExecuteIDLFile,
  ManageENVIAndIDLSession,
  PrepareIDLCodeCallback,
} from '@idl/mcp/idl';
import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { MCP_TOOL_LOOKUP, MCPSendRequestCallback } from '@idl/types/mcp';

/**
 * Creates an `MCPSendRequestCallback` that dispatches tool calls
 * directly to the core functions in `@idl/mcp/envi` and `@idl/mcp/idl`.
 *
 * This is the **standalone** path — it does not route through
 * the VS Code extension host or language server IPC.
 */
export function CreateStandaloneExecutionCallback(
  backend: IIDLExecutionBackend,
  prepareCode: PrepareIDLCodeCallback,
): MCPSendRequestCallback {
  const callback: MCPSendRequestCallback = async (
    executionId,
    tool,
    params,
  ) => {
    switch (tool) {
      case MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK:
        return CreateIDLNotebook(params as any) as any;

      case MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE:
        return ExecuteIDLCode(backend, params as any, prepareCode) as any;

      case MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE:
        return ExecuteIDLFile(backend, params as any) as any;

      case MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS:
        return ListENVIToolWorkflows(backend, params as any) as any;

      case MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION:
        return ManageENVIAndIDLSession(backend, params as any) as any;

      case MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI:
        return OpenDatasetsInENVI(backend, params as any) as any;

      case MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI:
        return QueryDatasetWithENVI(backend, params as any) as any;

      case MCP_TOOL_LOOKUP.RETURN_NOTES:
        return ReturnNotes(backend, params as any) as any;

      case MCP_TOOL_LOOKUP.RUN_ENVI_TOOL:
        return RunENVITool(backend, params as any) as any;

      default:
        return { success: false, err: `Unknown tool: ${tool}` } as any;
    }
  };

  return callback;
}
