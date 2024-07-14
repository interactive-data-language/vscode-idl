import {
  EXTENSION_FULL_NAME,
  ICON_THEME_NAME,
  IDL_COMMANDS,
  IDL_LANGUAGE_NAME,
} from '@idl/shared';
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
import { IIDLWorkspaceConfig } from './idl-config.interface';

/**
 * IDL's current workspace configuration
 */
export let IDL_EXTENSION_CONFIG: IIDLWorkspaceConfig;

/**
 * Get's IDL's workspace  config
 */
export async function InitializeExtensionConfig(onConfigChanges: () => void) {
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
  if (editor.get('defaultFormatter') !== EXTENSION_FULL_NAME) {
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

  // prompt user to change icon theme if default theme
  if (!IDL_EXTENSION_CONFIG.dontAsk.toOpenDocs) {
    await QuestionAsker(
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
