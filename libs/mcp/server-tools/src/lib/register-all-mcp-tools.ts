import { LogManager } from '@idl/logger';
import { IS_MCP_SERVER_STARTED, MCP_SERVER } from '@idl/mcp/server';
import { MCPToolInvokedCallback, MCPTools } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolHelper } from './mcp-tool-helper.class';
import { RegisterMCPTool_GetENVIToolWorkflow } from './tools/envi/register-mcp-tool-get-envi-tool-workflow';
import { RegisterMCPTool_ListENVIToolWorkflows } from './tools/envi/register-mcp-tool-list-envi-tool-workflows';
import { RegisterMCPTool_OpenDatasetsInENVI } from './tools/envi/register-mcp-tool-open-datasets-in-envi';
import { RegisterMCPTool_QueryDatasetWithENVI } from './tools/envi/register-mcp-tool-query-dataset-with-envi';
import { RegisterMCPTool_CreateIDLNotebook } from './tools/idl/register-mcp-tool-create-idl-notebook';
import { RegisterMCPTool_ExecuteIDLCode } from './tools/idl/register-mcp-tool-execute-idl-code';
import { RegisterMCPTool_ExecuteIDLFile } from './tools/idl/register-mcp-tool-execute-idl-file';
import { RegisterMCPTool_GetPrompt } from './tools/register-mcp-tool-get-prompt';
import { RegisterMCPTool_GetResource } from './tools/register-mcp-tool-get-resource';
import { RegisterMCPTool_ListAllResources } from './tools/register-mcp-tool-list-all-resources';
import { RegisterMCPTool_ListPrompts } from './tools/register-mcp-tool-list-prompts';
import { RegisterMCPTool_ManageIDLAndENVISession } from './tools/register-mcp-tool-manage-idl-and-envi-session';
import { RegisterMCPTool_SearchForFiles } from './tools/register-mcp-tool-search-for-files';
import { RegisterMCPTool_SearchResources } from './tools/register-mcp-tool-search-resources';

/**
 * Helper instance for managing MCP tool registration and execution
 */
export let MCP_TOOL_HELPER: MCPToolHelper;

/**
 * Track if we registered our tools or not
 */
let REGISTERED = false;

/**
 * Flag indicating if ENVI is installed
 */
export let IS_ENVI_INSTALLED = false;

/**
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPTools(
  messenger: VSCodeLanguageServerMessenger,
  logManager: LogManager,
  toolInvokedCallback: MCPToolInvokedCallback<MCPTools>,
  isEnviInstalled: boolean
) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }
  if (REGISTERED) {
    return;
  }

  // update flag for ENVI being installed
  IS_ENVI_INSTALLED = isEnviInstalled;

  // create helper instance with the MCP server
  MCP_TOOL_HELPER = new MCPToolHelper({
    mcpServer: MCP_SERVER,
    logManager,
    messenger,
    toolInvokedCallback,
  });

  /**
   * Register generic tools
   */
  RegisterMCPTool_GetPrompt(MCP_TOOL_HELPER);
  RegisterMCPTool_GetResource(MCP_TOOL_HELPER);
  RegisterMCPTool_ListAllResources(MCP_TOOL_HELPER);
  RegisterMCPTool_SearchForFiles(MCP_TOOL_HELPER);
  RegisterMCPTool_ListPrompts(MCP_TOOL_HELPER);
  RegisterMCPTool_SearchResources(MCP_TOOL_HELPER);

  /**
   * Register IDL tools
   */
  RegisterMCPTool_CreateIDLNotebook(MCP_TOOL_HELPER);
  RegisterMCPTool_ExecuteIDLCode(MCP_TOOL_HELPER);
  RegisterMCPTool_ExecuteIDLFile(MCP_TOOL_HELPER);

  /**
   * Register ENVI and IDL shared tools
   */
  RegisterMCPTool_ManageIDLAndENVISession(MCP_TOOL_HELPER);

  /**
   * ENVI tools
   *
   * The tools that use tasks are registered after the language server has started up
   */
  RegisterMCPTool_GetENVIToolWorkflow(MCP_TOOL_HELPER);
  RegisterMCPTool_ListENVIToolWorkflows(MCP_TOOL_HELPER);
  RegisterMCPTool_OpenDatasetsInENVI(MCP_TOOL_HELPER);
  RegisterMCPTool_QueryDatasetWithENVI(MCP_TOOL_HELPER);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;

  // return the tool helper
  return MCP_TOOL_HELPER;
}
