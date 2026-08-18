import { MCPServer } from '@idl/mcp/server';

import { RegisterMCPTool_GetENVIToolWorkflow } from './tools/envi/register-mcp-tool-get-envi-tool-workflow';
import { RegisterMCPTool_ListENVIToolWorkflows } from './tools/envi/register-mcp-tool-list-envi-tool-workflows';
import { RegisterMCPTool_OpenDatasetsInENVI } from './tools/envi/register-mcp-tool-open-datasets-in-envi';
import { RegisterMCPTool_QueryDatasetWithENVI } from './tools/envi/register-mcp-tool-query-dataset-with-envi';
import { RegisterMCPTool_SaveENVIToolWorkflow } from './tools/envi/register-mcp-tool-save-envi-tool-workflow';
import { RegisterMCPTool_TakeENVIScreenshot } from './tools/envi/register-mcp-tool-take-envi-screenshot';
import { RegisterMCPTool_CreateIDLNotebook } from './tools/idl/register-mcp-tool-create-idl-notebook';
import { RegisterMCPTool_InspectIDLState } from './tools/idl/register-mcp-tool-inspect-idl-state';
import { RegisterMCPTool_ManageIDLDebugger } from './tools/idl/register-mcp-tool-manage-idl-debugger';
import { RegisterMCPTool_QueryIDLSession } from './tools/idl/register-mcp-tool-query-idl-session';
import { RegisterMCPTool_RunIDLCode } from './tools/idl/register-mcp-tool-run-idl-code';
import { RegisterMCPTool_RunIDLFile } from './tools/idl/register-mcp-tool-run-idl-file';
import { RegisterMCPTool_ControlIDLAndENVISession } from './tools/register-mcp-tool-control-idl-and-envi-session';
import { RegisterMCPTool_GetResource } from './tools/register-mcp-tool-get-resource';
import { RegisterMCPTool_ListAllResources } from './tools/register-mcp-tool-list-all-resources';
import { RegisterMCPTool_SearchForFiles } from './tools/register-mcp-tool-search-for-files';
import { RegisterMCPTool_SearchResources } from './tools/register-mcp-tool-search-resources';

/**
 * Track if we registered our tools or not
 */
let REGISTERED = false;

/**
 * Flag indicating if ENVI is installed
 */
export let IS_ENVI_INSTALLED = false;

/**
 * Helper that adds all tools to the MCP server.
 *
 * Uses the MCPServer singleton — must be called after MCPServer.start().
 */
export function RegisterAllMCPTools(isEnviInstalled: boolean) {
  if (!MCPServer.isStarted) {
    return;
  }
  if (REGISTERED) {
    return;
  }

  // update flag for ENVI being installed
  IS_ENVI_INSTALLED = isEnviInstalled;

  /** Get the singleton server instance */
  const server = MCPServer.instance;

  /**
   * Register generic tools
   */
  RegisterMCPTool_GetResource(server);
  RegisterMCPTool_ListAllResources(server);
  RegisterMCPTool_SearchForFiles(server);
  RegisterMCPTool_SearchResources(server);

  /**
   * Register IDL tools
   */
  RegisterMCPTool_CreateIDLNotebook(server);
  RegisterMCPTool_RunIDLCode(server);
  RegisterMCPTool_RunIDLFile(server);
  RegisterMCPTool_InspectIDLState(server);
  RegisterMCPTool_ManageIDLDebugger(server);
  RegisterMCPTool_QueryIDLSession(server);

  /**
   * Register ENVI and IDL shared tools
   */
  RegisterMCPTool_ControlIDLAndENVISession(server);

  /**
   * ENVI tools
   *
   * The tools that use tasks are registered after the language server has started up
   */
  RegisterMCPTool_GetENVIToolWorkflow(server);
  RegisterMCPTool_ListENVIToolWorkflows(server);
  RegisterMCPTool_OpenDatasetsInENVI(server);
  RegisterMCPTool_QueryDatasetWithENVI(server);
  RegisterMCPTool_SaveENVIToolWorkflow(server);
  RegisterMCPTool_TakeENVIScreenshot(server);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;

  // return the server instance
  return server;
}
