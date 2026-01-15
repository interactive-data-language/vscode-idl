import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPToolParams,
  MCPToolResponse,
  MCPTools,
  MCPTools_VSCode,
} from '@idl/types/mcp';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  MCP_LSP_MessagePayload,
  MCP_LSP_MessageResponse,
} from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';

import { RunMCP_ENVIOpenDatasets } from './tools/envi/run-mcp-envi-open-datasets';
import { RunMCP_ENVIQueryDataset } from './tools/envi/run-mcp-envi-query-dataset';
import { RunMCP_ENVIRunTool } from './tools/envi/run-mcp-envi-run-tool';
import { RunMCP_ENVIStart } from './tools/envi/run-mcp-envi-start';
import { RunMCP_IDLCreateNotebook } from './tools/idl/run-mcp-idl-create-notebook';
import { RunMCP_IDLExecuteCode } from './tools/idl/run-mcp-idl-execute-code';
import { RunMCP_IDLExecuteFile } from './tools/idl/run-mcp-idl-execute-file';
import { RunMCP_IDLReturnNotes } from './tools/idl/run-mcp-idl-return-notes';
import { RunMCP_IDLStart } from './tools/idl/run-mcp-idl-start';

/**
 * Typed lookup of functions that we register for our tools
 */
export const MCP_TOOL_LOOKUP: {
  [key in MCPTools_VSCode]: (
    id: string,
    params: MCPToolParams<key>
  ) => MCPToolResponse<key> | Promise<MCPToolResponse<key>>;
} = {
  'open-datasets-in-envi': RunMCP_ENVIOpenDatasets,
  'query-dataset-with-envi': RunMCP_ENVIQueryDataset,
  'run-envi-tool': RunMCP_ENVIRunTool,
  'start-envi': RunMCP_ENVIStart,
  'create-idl-notebook': RunMCP_IDLCreateNotebook,
  'execute-idl-code': RunMCP_IDLExecuteCode,
  'execute-idl-file': RunMCP_IDLExecuteFile,
  'return-notes': RunMCP_IDLReturnNotes,
  'start-idl': RunMCP_IDLStart,
};

/**
 * Handle messages
 */
export async function RunMCPToolMessageHandler(
  payload: MCP_LSP_MessagePayload<MCPTools>
): Promise<MCP_LSP_MessageResponse<MCPTools>> {
  IDL_LOGGER.log({
    type: 'info',
    log: IDL_MCP_LOG,
    content: [
      `Run MCP tool: "${payload.tool}" with ID "${payload.id}"`,
      payload.params,
    ],
  });

  // make sure we know how to run the tool
  if (payload.tool in MCP_TOOL_LOOKUP) {
    // track tool usage
    VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
      idl_command: `mcp.${payload.tool}`,
    });

    // try to run
    try {
      // use any to override specific types
      const res = await MCP_TOOL_LOOKUP[payload.tool](
        payload.id,
        payload.params as any
      );

      IDL_LOGGER.log({
        type: 'info',
        log: IDL_MCP_LOG,
        content: [`MCP tool results: ${payload.tool}`, res],
      });

      return res;
    } catch (err) {
      // log error
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_MCP_LOG,
        content: [
          `Error while running MCP tool: ${payload.tool}`,
          payload.params,
          err,
        ],
      });

      // return that we failed
      return {
        success: false,
        err: 'There was an unhandled error during the execution of the tool',
      };
    }
  } else {
    // log error
    IDL_LOGGER.log({
      type: 'error',
      log: IDL_MCP_LOG,
      content: [`Unknown MCP tool: ${payload.tool}`, payload.params],
    });

    // also return that we failed
    return {
      success: false,
      err: 'Attempt to run an unknown tool',
    };
  }
}
