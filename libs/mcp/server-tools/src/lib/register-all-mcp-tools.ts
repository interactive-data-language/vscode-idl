import { LogManager } from '@idl/logger';
import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { MCPToolInvokedCallback, MCPTools } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolContext } from './mcp-tool-context.class';
import { RegisterMCPTool_GetENVIToolWorkflow } from './tools/envi/register-mcp-tool-get-envi-tool-workflow';
import { RegisterMCPTool_ListENVIToolWorkflows } from './tools/envi/register-mcp-tool-list-envi-tool-workflows';
import { RegisterMCPTool_OpenDatasetsInENVI } from './tools/envi/register-mcp-tool-open-datasets-in-envi';
import { RegisterMCPTool_QueryDatasetWithENVI } from './tools/envi/register-mcp-tool-query-dataset-with-envi';
import { RegisterMCPTool_StartENVI } from './tools/envi/register-mcp-tool-start-envi';
import { RegisterMCPTool_CreateIDLNotebook } from './tools/idl/register-mcp-tool-create-idl-notebook';
import { RegisterMCPTool_ExecuteIDLCode } from './tools/idl/register-mcp-tool-execute-idl-code';
import { RegisterMCPTool_ExecuteIDLFile } from './tools/idl/register-mcp-tool-execute-idl-file';
import { RegisterMCPTool_StartIDL } from './tools/idl/register-mcp-tool-start-idl';
import { RegisterMCPTool_GetResource } from './tools/register-mcp-tool-get-resource';
import { RegisterMCPTool_ListAllResources } from './tools/register-mcp-tool-list-all-resources';
import { RegisterMCPTool_SearchForFiles } from './tools/register-mcp-tool-search-for-files';
import { RegisterMCPTool_SearchResources } from './tools/register-mcp-tool-search-resources';

/**
 * Track contexts for all actively running tools so we can send notification
 * messages backand forth
 */
export const MCP_TOOL_CONTEXT = new MCPToolContext();

/**
 * Track if we registered our tools or not
 */
let REGISTERED = false;

/**
 * Placeholder for tool callback
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export let TOOL_INVOKED_CALLBACK: MCPToolInvokedCallback<MCPTools> = () => {};

/**
 *
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

  // save tool log callback
  TOOL_INVOKED_CALLBACK = toolInvokedCallback;

  /**
   * Register generic tools
   */
  RegisterMCPTool_GetResource(messenger);
  RegisterMCPTool_ListAllResources(messenger);
  RegisterMCPTool_SearchForFiles(messenger);
  RegisterMCPTool_SearchResources(messenger, logManager);

  /**
   * Register IDL tools
   */
  RegisterMCPTool_CreateIDLNotebook(messenger);
  RegisterMCPTool_ExecuteIDLCode(messenger);
  RegisterMCPTool_ExecuteIDLFile(messenger);
  RegisterMCPTool_StartIDL(messenger);

  /**
   * ENVI tools
   *
   * The tools that use tasks are registered after the language server has started up
   */
  RegisterMCPTool_GetENVIToolWorkflow(messenger);
  RegisterMCPTool_ListENVIToolWorkflows(messenger);
  RegisterMCPTool_OpenDatasetsInENVI(messenger);
  RegisterMCPTool_QueryDatasetWithENVI(messenger);
  RegisterMCPTool_StartENVI(messenger);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;
}
