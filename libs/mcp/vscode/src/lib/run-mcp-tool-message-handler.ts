import { IDL_MCP_LOG } from '@idl/logger';
import { MCPToolParams, MCPToolResponse, MCPTools } from '@idl/types/mcp';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  MCP_LSP_MessagePayload,
  MCP_LSP_MessageResponse,
} from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';

import { RunMCPCreateIDLNotebook } from './tools/run-mcp-create-idl-notebooks';
import { RunMCPExecuteIDLCode } from './tools/run-mcp-execute-idl-code';
import { RunMCPExecuteIDLFile } from './tools/run-mcp-execute-idl-file';
import { RunMCPOpenInENVI } from './tools/run-mcp-open-in-envi';
import { RunMCPRunENVITask } from './tools/run-mcp-run-envi-task';
import { RunMCPStartENVI } from './tools/run-mcp-start-envi';
import { RunMCPStartIDL } from './tools/run-mcp-start-idl';

/**
 * Typed lookup of functions that we register for our tools
 */
export const MCP_TOOL_LOOKUP: {
  [key in MCPTools]: (
    id: string,
    params: MCPToolParams<key>
  ) => MCPToolResponse<key> | Promise<MCPToolResponse<key>>;
} = {
  'create-idl-notebook': RunMCPCreateIDLNotebook,
  'execute-idl-code': RunMCPExecuteIDLCode,
  'execute-idl-file': RunMCPExecuteIDLFile,
  'open-in-envi': RunMCPOpenInENVI,
  'run-envi-task': RunMCPRunENVITask,
  'start-envi': RunMCPStartENVI,
  'start-idl': RunMCPStartIDL,
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
