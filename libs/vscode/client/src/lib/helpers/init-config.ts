import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_EXTENSION_CONFIG, UpdateConfigObject } from '@idl/vscode/config';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import {
  IDL_EXTENSION_CONFIG_KEYS,
  IDontAskConfig,
} from '@idl/vscode/extension-config';
import * as vscode from 'vscode';

import { IDL_LOGGER } from '../initialize-client';
import { LANGUAGE_SERVER_MESSENGER } from '../start-language-server';

/**
 * Asks the user if they want to initialize config for a workspace or not
 * and handles any errors or preferences as well
 */
export async function InitConfig(folder: string) {
  // return if we should never ask
  if (IDL_EXTENSION_CONFIG.dontAsk.toInitConfig) {
    return;
  }

  try {
    // make sure we havent already ignored this folder
    if (
      IDL_EXTENSION_CONFIG.dontAsk.toInitConfigForTheseFolders.indexOf(
        folder
      ) !== -1
    ) {
      return;
    }

    // ask le question
    const res = await vscode.window.showInformationMessage(
      `${IDL_TRANSLATION.notifications.initIDLJSON} "${folder}"`,
      ...[
        IDL_TRANSLATION.notifications.yes,
        IDL_TRANSLATION.notifications.no,
        IDL_TRANSLATION.commands.notifications.initConfig.dontAsk,
        IDL_TRANSLATION.commands.notifications.initConfig.neverAsk,
      ]
    );

    // check what our response was
    switch (res) {
      case IDL_TRANSLATION.notifications.yes:
        LANGUAGE_SERVER_MESSENGER.sendNotification(
          LANGUAGE_SERVER_MESSAGE_LOOKUP.INIT_WORKSPACE_CONFIG,
          { folder }
        );
        break;
      case IDL_TRANSLATION.commands.notifications.initConfig.dontAsk:
        // extra sanity check to make sure we didnt already add
        // something to our preference
        if (
          IDL_EXTENSION_CONFIG.dontAsk.toInitConfigForTheseFolders.indexOf(
            folder
          ) === -1
        ) {
          // add folder
          IDL_EXTENSION_CONFIG.dontAsk.toInitConfigForTheseFolders.push(folder);

          // save preference
          UpdateConfigObject<IDontAskConfig>(
            IDL_EXTENSION_CONFIG_KEYS.dontAsk,
            {
              toInitConfigForTheseFolders:
                IDL_EXTENSION_CONFIG.dontAsk.toInitConfigForTheseFolders,
            }
          );
        }
        break;
      case IDL_TRANSLATION.commands.notifications.initConfig.neverAsk:
        UpdateConfigObject<IDontAskConfig>(IDL_EXTENSION_CONFIG_KEYS.dontAsk, {
          toInitConfig: true,
        });
        break;
      default:
        // do nothing
        break;
    }
  } catch (err) {
    // ignore messages where vscode is closed while the dialog is open
    if (err.message === 'Canceled') {
      return;
    }

    IDL_LOGGER.log({
      type: 'error',
      content: ['Error while initializing config for workspace', err],
      alert: IDL_TRANSLATION.commands.errors.code.initializeConfig,
    });
  }
}
