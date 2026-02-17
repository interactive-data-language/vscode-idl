import { MCPToolHelper } from '@idl/mcp/server-tools';
import { IDLIndex } from '@idl/parsing/index';

import { RegisterMCPTool_GetRoutineDocs } from './globals/register-mcp-tool-get-routine-docs';
import { RegisterMCPTool_ResourcesSearchForRoutine } from './globals/register-mcp-tool-search-for-routine';

/**
 * Registers all MCP tools that require the language server
 */
export function RegisterAllLanguageServerMCPTools(
  helper: MCPToolHelper,
  index: IDLIndex
) {
  RegisterMCPTool_GetRoutineDocs(helper, index);
  RegisterMCPTool_ResourcesSearchForRoutine(helper, index);
}
