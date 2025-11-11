import {
  EXTENSION_FULL_NAME,
  ICON_THEME_NAME,
  IDL_COMMANDS,
  IDL_LANGUAGE_NAME,
} from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDL_EXTENSION_CONFIG_KEYS,
  IDontAskConfig,
} from '@idl/vscode/extension-config';
import copy from 'fast-copy';
import * as vscode from 'vscode';

import { GetWorkspaceConfig } from './helpers/get-workspace-config';
import { BasicQuestionAsker, QuestionAsker } from './helpers/question-asker';
import { UpdateConfigObject } from './helpers/update-config';
import { ValidateConfig } from './helpers/validate-config';
import {
  CopilotInstructionFileExists,
  isIDLWorkspace,
  isWorkspaceFileVersionDifferent,
} from './helpers/workspace-checks';
import { IIDLWorkspaceConfig } from './idl-config.interface';
/**
 * IDL's current workspace configuration
 */
export let IDL_EXTENSION_CONFIG: IIDLWorkspaceConfig;

/**
 * Get's IDL's workspace  config
 *
 * DONT AWAIT THIS FUNCTION
 *
 * It has some blocking async logic so that you arent spammed with questions
 *
 * So, if you await this callback, it will wait until all questions are answered before returning
 *
 * @param ctx Extension context
 * @param onConfigChanges Callback when config changes
 */
export async function InitializeExtensionConfig(
  ctx: vscode.ExtensionContext,
  onConfigChanges: () => void
) {
  // get the current workspace config
  IDL_EXTENSION_CONFIG = GetWorkspaceConfig();

  /**
   * Track previous developer settings
   */
  let OLD_DEVELOPER = copy(
    IDL_EXTENSION_CONFIG.get(IDL_EXTENSION_CONFIG_KEYS.developer)
  );

  // make sure our configuration is OK
  ValidateConfig(IDL_EXTENSION_CONFIG);

  // listen for configuration (preference) changes
  vscode.workspace.onDidChangeConfiguration((ev) => {
    // filter if we arent changing IDL configurations
    if (ev.affectsConfiguration(IDL_LANGUAGE_NAME)) {
      // get new workspace configuration
      IDL_EXTENSION_CONFIG = GetWorkspaceConfig();

      // make sure our configuration is OK
      ValidateConfig(IDL_EXTENSION_CONFIG);

      /**
       * DONT DO THIS, but leaving code in place. We hid this setting from VSCode, so this
       * logic always triggers because it does not have the new value.
       *
       * Check for developer settings changes
       */
      // if (
      //   !deepEqual(
      //     OLD_DEVELOPER,
      //     IDL_EXTENSION_CONFIG.get(IDL_EXTENSION_CONFIG_KEYS.developer)
      //   )
      // ) {
      //   BasicQuestionAsker(IDL_TRANSLATION.configuration.reloadWindow, () => {
      //     IDL_COMMANDS;
      //     vscode.commands.executeCommand(VSCODE_COMMANDS.RELOAD_WINDOW);
      //   });
      // }

      // update our developer settings
      OLD_DEVELOPER = copy(IDL_EXTENSION_CONFIG.developer);

      // execute our callback that we have had changes
      onConfigChanges();
    }
  });

  // check our default formatter preference
  const editor = vscode.workspace.getConfiguration('editor', {
    languageId: IDL_LANGUAGE_NAME,
  });

  // check if we should ask about setting the default formatter
  if (
    editor.get('defaultFormatter') !== EXTENSION_FULL_NAME &&
    !IDL_EXTENSION_CONFIG.dontAsk.forFormatterChange
  ) {
    await QuestionAsker(
      IDL_TRANSLATION.notifications.changeFormatter,
      IDL_EXTENSION_CONFIG_KEYS.dontAskForFormatterChange,
      true,
      () => {
        UpdateConfigObject<IDontAskConfig>(IDL_EXTENSION_CONFIG_KEYS.dontAsk, {
          forFormatterChange: true,
        });
      },
      async () => {
        editor.update(
          'defaultFormatter',
          EXTENSION_FULL_NAME,
          vscode.ConfigurationTarget.Global,
          true
        );

        // check if we also need to format on save
        if (!editor.get('formatOnSave')) {
          await BasicQuestionAsker(
            IDL_TRANSLATION.notifications.formatOnSave,
            () => {
              editor.update(
                'formatOnSave',
                true,
                vscode.ConfigurationTarget.Global,
                true
              );
            }
          );
        }
      }
    );
  }

  // check for our client theme
  const config = vscode.workspace.getConfiguration('workbench');

  // prompt user to change icon theme if default theme
  if (
    config.iconTheme !== ICON_THEME_NAME &&
    !IDL_EXTENSION_CONFIG.dontAsk.forIconChange
  ) {
    await QuestionAsker(
      IDL_TRANSLATION.notifications.changeIcons,
      IDL_EXTENSION_CONFIG_KEYS.dontAskForIconChange,
      true,
      () => {
        UpdateConfigObject<IDontAskConfig>(IDL_EXTENSION_CONFIG_KEYS.dontAsk, {
          forIconChange: true,
        });
      },
      () => {
        config.update(
          'iconTheme',
          ICON_THEME_NAME,
          vscode.ConfigurationTarget.Global
        );
      }
    );
  }

  // check for configured MCP server
  /** Get MCP config */
  const mcpConfig = vscode.workspace.getConfiguration('mcp');

  /** Get servers */
  const servers = mcpConfig.has('servers') ? mcpConfig.get('servers') : {};

  // if we have old naming convention for MCP, then migrate
  if (IDL_TRANSLATION.packageJSON.displayName in (servers as any)) {
    const patch = {};

    // migrate to proper name
    patch[EXTENSION_FULL_NAME] =
      servers[IDL_TRANSLATION.packageJSON.displayName];

    /**
     * Get patched object
     */
    const patched = {
      ...((mcpConfig.get('servers') as any) || {}),
      ...patch,
    };

    // delete old key
    delete patched[IDL_TRANSLATION.packageJSON.displayName];

    /**
     * Fetch the default keys so that we can remove a weird python default MCP
     * server (which is wild since it doesnt work and its hidden if you open user settings)
     */
    const defaultKeys = Object.keys(
      mcpConfig.inspect('servers')?.defaultValue || {}
    );
    for (let i = 0; i < defaultKeys.length; i++) {
      delete patched[defaultKeys[i]];
    }

    // patch config
    mcpConfig.update('servers', patched, true);
  }

  // prompt user to change icon theme if default theme
  if (
    !(EXTENSION_FULL_NAME in (servers as any)) &&
    !IDL_EXTENSION_CONFIG.dontAsk.forMCPConfig
  ) {
    await QuestionAsker(
      IDL_TRANSLATION.notifications.configureMCP,
      IDL_EXTENSION_CONFIG_KEYS.dontAskForMCPConfig,
      true,
      () => {
        UpdateConfigObject<IDontAskConfig>(IDL_EXTENSION_CONFIG_KEYS.dontAsk, {
          forMCPConfig: true,
        });
      },
      () => {
        const patch = {};
        patch[EXTENSION_FULL_NAME] = {
          type: 'sse',
          url: `http://localhost:${IDL_EXTENSION_CONFIG.mcp.port}/sse`,
        };

        /**
         * Get patched object
         */
        const patched = {
          ...((mcpConfig.get('servers') as any) || {}),
          ...patch,
        };

        // delete old key
        delete patched[IDL_TRANSLATION.packageJSON.displayName];

        /**
         * Fetch the default keys so that we can remove a weird python default MCP
         * server (which is wild since it doesnt work and its hidden if you open user settings)
         */
        const defaultKeys = Object.keys(
          mcpConfig.inspect('servers')?.defaultValue || {}
        );
        for (let i = 0; i < defaultKeys.length; i++) {
          delete patched[defaultKeys[i]];
        }

        // patch config
        mcpConfig.update('servers', patched, true);
      }
    );
  }

  // 10/24/2025 letting dontAsk docs be the last question to maintain await logic.
  // Await is missing for the last one to avoid blocking the extension activation.
  // TODO: handle on setting change at the top of this file.

  // Check if we should prompt about GitHub Agent instructions
  // Only ask if user hasn't opted out and we're in an IDL workspace
  if (!IDL_EXTENSION_CONFIG.dontAsk.toSetupCopilotInstructions) {
    const isIDL = await isIDLWorkspace();

    if (isIDL) {
      const fileExists = await CopilotInstructionFileExists();
      let shouldAsk = false;
      let versionIsDifferent = false;
      let message = '';

      if (!fileExists) {
        // No copilot instructions file - ask to set up
        shouldAsk = true;
        message = IDL_TRANSLATION.notifications.setupCopilotInstructions;
      } else if (
        await isWorkspaceFileVersionDifferent(
          ctx.extensionUri,
          'AGENTS.md',
          'extension/templates/AGENTS.md'
        )
      ) {
        // File exists but is outdated - ask to update
        versionIsDifferent = true;
        shouldAsk = true;
        message = IDL_TRANSLATION.notifications.updateCopilotInstructions;
      }

      if (shouldAsk) {
        await QuestionAsker(
          message,
          IDL_EXTENSION_CONFIG_KEYS.dontAskToSetupCopilotInstructions,
          true,
          () => {
            // if user clicks "Don't ask again"
            UpdateConfigObject<IDontAskConfig>(
              IDL_EXTENSION_CONFIG_KEYS.dontAsk,
              {
                toSetupCopilotInstructions: true,
              }
            );
          },
          () => {
            // if user clicks "Yes"
            // Pass true to force update (skip overwrite confirmation when updating version)
            vscode.commands.executeCommand(
              IDL_COMMANDS.COPILOT.SETUP_INSTRUCTIONS,
              versionIsDifferent
            );
          }
        );
      }
    }
  }

  // ask user if they want to open the documentation
  if (!IDL_EXTENSION_CONFIG.dontAsk.toOpenDocs) {
    QuestionAsker(
      IDL_TRANSLATION.notifications.openDocs,
      IDL_EXTENSION_CONFIG_KEYS.dontAskToOpenDocs,
      true,
      () => {
        UpdateConfigObject<IDontAskConfig>(IDL_EXTENSION_CONFIG_KEYS.dontAsk, {
          toOpenDocs: true,
        });
      },
      () => {
        vscode.commands.executeCommand(IDL_COMMANDS.DOCS.OPEN);
      }
    );
  }
}
