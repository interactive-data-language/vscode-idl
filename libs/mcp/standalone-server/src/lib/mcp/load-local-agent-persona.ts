import { GetExtensionPath, IFolderRecursion } from '@idl/idl/files';
import { IDL_LSP_LOG } from '@idl/logger';
import { ENVI_TOOL_WORKFLOW_REGISTRY } from '@idl/mcp/server-tools';
import { existsSync } from 'fs';
import { join } from 'path';

import {
  LOG_MANAGER,
  MCP_INSTRUCTION_REGISTRY,
} from './create-standalone-mcp-server';

/**
 * Checks for local agent persona that we need to load
 */
export async function LoadLocalAgentPersona(idlSearchPath: IFolderRecursion) {
  /**
   * Check for configuration packaged with our app
   *
   * This allows us to include extensions, custom_code, and tool workflows
   * without having to install in other locations
   *
   * Premise of this is a simpler setup/use without manipulating file systems
   */
  try {
    /**
     * Check for local config at root of extension directory
     */
    const configDir = GetExtensionPath('config');

    // log that we found it if we make it here
    LOG_MANAGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Found local config folder, checking for content to load`,
    });

    /**
     * See if we have custom code
     */
    const customCode = join(configDir, 'custom_code');
    if (existsSync(customCode)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/custom_code`,
      });
      process.env['ENVI_CUSTOM_CODE'] = customCode;
      idlSearchPath[customCode] = true;
    }

    /**
     * See if we have extensions
     */
    const extensions = join(configDir, 'extensions');
    if (existsSync(extensions)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/extensions`,
      });
      process.env['ENVI_EXTENSIONS'] = extensions;
      idlSearchPath[extensions] = true;
    }

    /**
     * See if we have workflows
     */
    const workflows = join(configDir, 'envi-tool-workflows');
    if (existsSync(workflows)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/envi-tool-workflows`,
      });
      // load and overwrite any that we already have
      ENVI_TOOL_WORKFLOW_REGISTRY.loadWorkflowsFromFolder(workflows, true);
    }

    /**
     * See if we have instructions
     */
    const instructions = join(configDir, 'instructions');
    if (existsSync(instructions)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/instructions`,
      });
      // load and overwrite any that we already have
      MCP_INSTRUCTION_REGISTRY.loadInstructionsFromFolder(instructions, true);
    }
  } catch (err) {
    // expected when there is no config folder, so log it as informational
    if (
      err instanceof Error &&
      err.message.includes('Unable to locate file or folder: "config"')
    ) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Did not find local config folder`,
      });
      return;
    }

    // anything else is an unexpected problem
    LOG_MANAGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: [`Error while loading local config folder`, err],
    });
  }
}
