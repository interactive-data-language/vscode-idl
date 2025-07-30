import { IDL_LSP_LOG } from '@idl/logger';
import {
  RegisterToolQueryENVITaskParameters,
  RegisterToolQueryENVITasks,
  RegisterToolRunENVITask,
  TrackENVITaskForMCPServer,
} from '@idl/mcp/server-tools';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/core';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { IDL_INDEX } from '../events/initialize-document-manager';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from '../initialize-language-server';
import { FilterMCPENVITasks } from './filter-mcp-envi-tasks';

/**
 * Registers user MCP tools from code and tasks that we have parsed
 *
 * WIP: Not complete and GitHub Copilot isn't the best here
 */
export async function RegisterUserMCPTools(
  messenger: VSCodeLanguageServerMessenger
) {
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: 'Registering MCP user tools',
  });

  // register additional tools
  RegisterToolQueryENVITasks(messenger);
  RegisterToolQueryENVITaskParameters(messenger);
  RegisterToolRunENVITask(messenger);

  /** Get all structures that we know about */
  const structures =
    IDL_INDEX.globalIndex.globalTokensByTypeByName[
      GLOBAL_TOKEN_TYPES.STRUCTURE
    ];

  /** Find names of ENVI Tasks  */
  const keys = FilterMCPENVITasks(Object.keys(structures)).sort();

  // add all ENVI Tasks
  for (let i = 0; i < keys.length; i++) {
    TrackENVITaskForMCPServer(
      SERVER_MESSENGER,
      structures[keys[i]][0] as IGlobalIndexedToken<GlobalStructureToken>,
      `${i}`
    );
  }
}
