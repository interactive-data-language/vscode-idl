import { IDL_MCP_VSCODE_LOG } from '@idl/logger';
import { EXTENSION_FULL_NAME } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

/**
 * Remove MCP config from user's "mcp.json"
 */
export async function RemoveLegacyMCPConfig() {
  try {
    /** Get MCP config */
    const mcpConfig = vscode.workspace.getConfiguration('mcp');

    /** Get servers */
    const servers = mcpConfig.has('servers') ? mcpConfig.get('servers') : {};

    /**
     * Check if we need to remove old MCP configuration
     */
    if (
      IDL_TRANSLATION.packageJSON.displayName in (servers as any) ||
      EXTENSION_FULL_NAME in (servers as any)
    ) {
      const patch = {};

      /**
       * Get patched object
       */
      const patched = {
        ...((mcpConfig.get('servers') as any) || {}),
        ...patch,
      };

      // delete old keys
      delete patched[IDL_TRANSLATION.packageJSON.displayName];
      delete patched[EXTENSION_FULL_NAME];

      // patch config
      await mcpConfig.update('servers', patched, true);
    }
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_MCP_VSCODE_LOG,
      type: 'error',
      content: ['Problem removing legacy MCG configuration', err],
    });
  }
}
