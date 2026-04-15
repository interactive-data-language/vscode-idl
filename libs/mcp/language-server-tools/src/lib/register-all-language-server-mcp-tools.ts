import { MCPServer } from '@idl/mcp/server';
import { IDLIndex } from '@idl/parsing/index';

import { RegisterMCPTool_GetRoutineDocs } from './globals/register-mcp-tool-get-routine-docs';
import { RegisterMCPTool_ResourcesSearchForRoutine } from './globals/register-mcp-tool-search-for-routine';

/**
 * Registers all MCP tools that require the language server
 */
export function RegisterAllLanguageServerMCPTools(
  server: MCPServer,
  index: IDLIndex,
  getWorkspacesCallback: () => string[],
) {
  RegisterMCPTool_GetRoutineDocs(server, index);
  RegisterMCPTool_ResourcesSearchForRoutine(
    server,
    index,
    getWorkspacesCallback,
  );
}
