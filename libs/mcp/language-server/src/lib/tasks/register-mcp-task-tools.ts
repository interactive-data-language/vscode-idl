import { IDL_LSP_LOG, IDL_MCP_LOG, LogManager } from '@idl/logger';
import { MCP_SERVER } from '@idl/mcp/server';
import {
  RegisterMCPTool_ENVIGetToolParameters,
  RegisterMCPTool_ENVIListTools,
  RegisterMCPTool_ENVIRunTool,
} from '@idl/mcp/server-tools';
import { FilterMCPENVITasks, MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLIndex } from '@idl/parsing/index';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RegisterENVITaskNotes } from './register-envi-task-notes';

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
  RegisterMCPTool_ENVIListTools(messenger, registry);
  RegisterMCPTool_ENVIGetToolParameters(messenger, registry);
  RegisterMCPTool_ENVIRunTool(messenger, registry);

  /** Get all structures that we know about */
  const structures =
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE];

  /** Find names of ENVI Tasks and exclude those we dont need to expose  */
  const keys = FilterMCPENVITasks(Object.keys(structures)).sort();

  logger.log({
    log: IDL_MCP_LOG,
    type: 'info',
    content: `Attempting to register ${keys.length} ENVI Tools`,
  });

  // add all ENVI Tasks
  for (let i = 0; i < keys.length; i++) {
    registry.registerTask(
      structures[keys[i]][0] as IGlobalIndexedToken<GlobalStructureToken>
    );
  }

  logger.log({
    log: IDL_MCP_LOG,
    type: 'info',
    content: `Attempting to load user ENVI Tool notes`,
  });

  // load notes
  RegisterENVITaskNotes(registry, logger);

  // emit MCP event that tools have changed
  MCP_SERVER.sendToolListChanged();
}
