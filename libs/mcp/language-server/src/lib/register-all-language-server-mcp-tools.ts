import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RegisterMCPTool_GetRoutineDocs } from './globals/register-mcp-tool-resources-get-routine-docs';
import { RegisterMCPTool_ResourcesSearchForRoutine } from './globals/register-mcp-tool-resources-search-for-routine';

/**
 * Registers all MCP tools that require the language server
 */
export function RegisterAllLanguageServerMCPTools(
  messenger: VSCodeLanguageServerMessenger,
  index: IDLIndex,
  logger: LogManager
) {
  // register MCP tools special to the language serv er
  RegisterMCPTool_GetRoutineDocs(messenger, index);
  RegisterMCPTool_ResourcesSearchForRoutine(messenger, index);
}
