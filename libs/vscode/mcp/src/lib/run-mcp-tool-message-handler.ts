import { ObjectifyError } from '@idl/error-shared';
import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPToolParams,
  MCPToolResponse,
  MCPTools_VSCode,
} from '@idl/types/mcp';
import {
  MCP_LSP_MessagePayload,
  MCP_LSP_MessageResponse,
} from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';

import { RunMCPTool_ListENVIToolWorkflows } from './tools/envi/run-mcp-tool-list-envi-tool-workflows';
import { RunMCPTool_OpenDatasetsInENVI } from './tools/envi/run-mcp-tool-open-datasets-in-envi';
import { RunMCPTool_QueryDatasetWithENVI } from './tools/envi/run-mcp-tool-query-dataset-with-envi';
import { RunMCPTool_RunENVITool } from './tools/envi/run-mcp-tool-run-envi-tool';
import { RunMCPTool_CreateIDLNotebook } from './tools/idl/run-mcp-tool-create-idl-notebook';
import { RunMCPTool_ExecuteIDLCode } from './tools/idl/run-mcp-tool-execute-idl-code';
import { RunMCPTool_ExecuteIDLFile } from './tools/idl/run-mcp-tool-execute-idl-file';
import { RunMCPTool_ManageENVIAndIDLSession } from './tools/run-mcp-tool-manage-envi-and-idl-session';
import { RunMCPTool_ReturnNotes } from './tools/run-mcp-tool-return-notes';

/**
 * Typed lookup of functions that we register for our tools
 */
export const RUN_MCP_TOOL_LOOKUP: {
  [key in MCPTools_VSCode]: (
    id: string,
    params: MCPToolParams<key>
  ) => MCPToolResponse<key> | Promise<MCPToolResponse<key>>;
} = {
  'create-idl-notebook': RunMCPTool_CreateIDLNotebook,
  'execute-idl-code': RunMCPTool_ExecuteIDLCode,
  'execute-idl-file': RunMCPTool_ExecuteIDLFile,
  'list-envi-tool-workflows': RunMCPTool_ListENVIToolWorkflows,
  'manage-idl-and-envi-session': RunMCPTool_ManageENVIAndIDLSession,
  'open-datasets-in-envi': RunMCPTool_OpenDatasetsInENVI,
  'query-dataset-with-envi': RunMCPTool_QueryDatasetWithENVI,
  'return-notes': RunMCPTool_ReturnNotes,
  'run-envi-tool': RunMCPTool_RunENVITool,
};

/**
 * Handle messages
 */
export async function RunMCPToolMessageHandler(
  payload: MCP_LSP_MessagePayload<MCPTools_VSCode>
): Promise<MCP_LSP_MessageResponse<MCPTools_VSCode>> {
  IDL_LOGGER.log({
    type: 'info',
    log: IDL_MCP_LOG,
    content: [
      `Run MCP tool: "${payload.tool}" with ID "${payload.id}"`,
      payload.params,
    ],
  });

  // make sure we know how to run the tool
  if (payload.tool in RUN_MCP_TOOL_LOOKUP) {
    // try to run
    try {
      // use any to override specific types
      const res = await RUN_MCP_TOOL_LOOKUP[payload.tool](
        payload.id,
        payload.params as any
      );

      IDL_LOGGER.log({
        type: 'debug',
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

      /** Error string */
      let asString = '';

      // check the reported error reason
      switch (true) {
        case typeof err === 'string':
          asString = err;
          break;
        case Array.isArray(err):
          asString = JSON.stringify(err);
          break;
        default:
          asString = JSON.stringify(ObjectifyError(err));
          break;
      }

      // return that we failed
      return {
        success: false,
        err: `There was an unhandled error during the execution of the tool: "${asString}"`,
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
