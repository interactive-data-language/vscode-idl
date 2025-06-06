import { RegisterToolRunENVITask } from '@idl/mcp/server-tools';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/core';

import { IDL_INDEX } from '../events/initialize-document-manager';
import { SERVER_MESSENGER } from '../initialize-language-server';

/**
 * Registers user MCP tools from code and tasks that we have parsed
 */
export async function RegisterUserMCPTools() {
  /** Get all structures that we know about */
  const structures =
    IDL_INDEX.globalIndex.globalTokensByTypeByName[
      GLOBAL_TOKEN_TYPES.STRUCTURE
    ];

  /** Find names of ENVI Tasks  */
  const keys = Object.keys(structures).filter(
    (struct) => struct.startsWith('envi') && struct.endsWith('task')
  );

  // add all ENVI Tasks
  for (let i = 0; i < keys.length; i++) {
    RegisterToolRunENVITask(
      SERVER_MESSENGER,
      structures[keys[i]][0] as IGlobalIndexedToken<GlobalStructureToken>,
      `${i}`
    );
  }
}
