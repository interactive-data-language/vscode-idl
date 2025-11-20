import { IDL_LSP_LOG, LogManager } from '@idl/logger';
import { MCP_SERVER } from '@idl/mcp/server';
import {
  RegisterMCPTool_ENVIGetTaskParameters,
  RegisterMCPTool_ENVIListTasks,
  RegisterMCPTool_ENVIRunTask,
  TrackENVITaskForMCPServer,
} from '@idl/mcp/server-tools';
import { IDLIndex } from '@idl/parsing/index';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { FilterMCPENVITasks } from './filter-mcp-envi-tasks';

/**
 * Registers user MCP tools from code and tasks that we have parsed
 *
 * WIP: Not complete and GitHub Copilot isn't the best here
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

  // register additional tools
  RegisterMCPTool_ENVIListTasks(messenger);
  RegisterMCPTool_ENVIGetTaskParameters(messenger);
  RegisterMCPTool_ENVIRunTask(messenger);

  /** Get all structures that we know about */
  const structures =
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE];

  /** Find names of ENVI Tasks  */
  const keys = FilterMCPENVITasks(Object.keys(structures)).sort();

  // add all ENVI Tasks
  for (let i = 0; i < keys.length; i++) {
    TrackENVITaskForMCPServer(
      structures[keys[i]][0] as IGlobalIndexedToken<GlobalStructureToken>
    );
  }

  // emit MCP event that tools have changed
  MCP_SERVER.sendToolListChanged();
}
