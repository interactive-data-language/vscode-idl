import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolContext } from './mcp-tool-context.class';
import { RegisterMCPTool_ENVIOpenDataset } from './tools/envi/register-mcp-tool-envi-open-dataset';
import { RegisterMCPTool_ENVIQueryDataset } from './tools/envi/register-mcp-tool-envi-query-dataset';
import { RegisterMCPTool_ENVIStart } from './tools/envi/register-mcp-tool-envi-start';
import { RegisterMCPTool_IDLCreateNotebook } from './tools/idl/register-mcp-tool-idl-create-notebook';
import { RegisterMCPTool_IDLExecuteCode } from './tools/idl/register-mcp-tool-idl-execute-code';
import { RegisterMCPTool_IDLExecuteFile } from './tools/idl/register-mcp-tool-idl-execute-file';
import { RegisterMCPTool_IDLStart } from './tools/idl/register-mcp-tool-idl-start';
import { RegisterMCPTool_ResourcesGetResource } from './tools/resources/register-mcp-tool-resources-get-resource';
import { RegisterMCPTool_ResourcesListAll } from './tools/resources/register-mcp-tool-resources-list-all';
import { RegisterMCPTool_ResourcesSearchResources } from './tools/resources/register-mcp-tool-resources-search';

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
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPTools(messenger: VSCodeLanguageServerMessenger) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }
  if (REGISTERED) {
    return;
  }

  /**
   * Register all of our tools
   */
  RegisterMCPTool_IDLCreateNotebook(messenger);
  RegisterMCPTool_IDLExecuteCode(messenger);
  RegisterMCPTool_IDLExecuteFile(messenger);
  RegisterMCPTool_IDLStart(messenger);
  RegisterMCPTool_ENVIOpenDataset(messenger);
  RegisterMCPTool_ENVIQueryDataset(messenger);
  RegisterMCPTool_ENVIStart(messenger);
  RegisterMCPTool_ResourcesGetResource(messenger);
  RegisterMCPTool_ResourcesListAll(messenger);
  RegisterMCPTool_ResourcesSearchResources(messenger);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;
}
