import { MCPServer } from '@idl/mcp/server';

import { RegisterMCPTool_GetENVIToolWorkflow } from './tools/envi/register-mcp-tool-get-envi-tool-workflow';
import { RegisterMCPTool_ListENVIToolWorkflows } from './tools/envi/register-mcp-tool-list-envi-tool-workflows';
import { RegisterMCPTool_OpenDatasetsInENVI } from './tools/envi/register-mcp-tool-open-datasets-in-envi';
import { RegisterMCPTool_QueryDatasetWithENVI } from './tools/envi/register-mcp-tool-query-dataset-with-envi';
import { RegisterMCPTool_CreateIDLNotebook } from './tools/idl/register-mcp-tool-create-idl-notebook';
import { RegisterMCPTool_ExecuteIDLCode } from './tools/idl/register-mcp-tool-execute-idl-code';
import { RegisterMCPTool_ExecuteIDLFile } from './tools/idl/register-mcp-tool-execute-idl-file';
import { RegisterMCPTool_CreateENVIModelerWorkflow } from './tools/register-mcp-tool-create-envi-modeler-workflow';
import { RegisterMCPTool_GetResource } from './tools/register-mcp-tool-get-resource';
import { RegisterMCPTool_ListAllResources } from './tools/register-mcp-tool-list-all-resources';
import { RegisterMCPTool_ManageIDLAndENVISession } from './tools/register-mcp-tool-manage-idl-and-envi-session';
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
  RegisterMCPTool_CreateENVIModelerWorkflow(server);
  RegisterMCPTool_GetResource(server);
  RegisterMCPTool_ListAllResources(server);
  RegisterMCPTool_SearchForFiles(server);
  RegisterMCPTool_SearchResources(server);

  /**
   * Register IDL tools
   */
  RegisterMCPTool_CreateIDLNotebook(server);
  RegisterMCPTool_ExecuteIDLCode(server);
  RegisterMCPTool_ExecuteIDLFile(server);

  /**
   * Register ENVI and IDL shared tools
   */
  RegisterMCPTool_ManageIDLAndENVISession(server);

  /**
   * ENVI tools
   *
   * The tools that use tasks are registered after the language server has started up
   */
  RegisterMCPTool_GetENVIToolWorkflow(server);
  RegisterMCPTool_ListENVIToolWorkflows(server);
  RegisterMCPTool_OpenDatasetsInENVI(server);
  RegisterMCPTool_QueryDatasetWithENVI(server);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;

  // return the server instance
  return server;
}
