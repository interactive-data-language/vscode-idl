import { IDL_LSP_LOG, LogManager } from '@idl/logger';
import { MCP_SERVER } from '@idl/mcp/server';
import {
  RegisterMCPTool_ENVIGetTaskParameters,
  RegisterMCPTool_ENVIListTasks,
  RegisterMCPTool_ENVIRunTask,
} from '@idl/mcp/server-tools';
import { FilterMCPENVITasks, MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLIndex } from '@idl/parsing/index';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

/**
 * Registers MCP Task tools from parsed code on IDL's search path
 */
export async function RegisterMCPTaskTools(
  index: IDLIndex,
  logger: LogManager,
  messenger: VSCodeLanguageServerMessenger
) {
  logger.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: 'Registering MCP user tools',
  });

  /** Create task registry */
  const registry = new MCPTaskRegistry(logger);

  // register tools for tasks
  RegisterMCPTool_ENVIListTasks(messenger, registry);
  RegisterMCPTool_ENVIGetTaskParameters(messenger, registry);
  RegisterMCPTool_ENVIRunTask(messenger, registry);

  /** Get all structures that we know about */
  const structures =
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE];

  /** Find names of ENVI Tasks and exclude those we dont need to expose  */
  const keys = FilterMCPENVITasks(Object.keys(structures)).sort();

  logger.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: `Attempting to register ${keys.length} ENVI Tools`,
  });

  // add all ENVI Tasks
  for (let i = 0; i < keys.length; i++) {
    registry.registerTask(
      structures[keys[i]][0] as IGlobalIndexedToken<GlobalStructureToken>
    );
  }

  // emit MCP event that tools have changed
  MCP_SERVER.sendToolListChanged();
}
