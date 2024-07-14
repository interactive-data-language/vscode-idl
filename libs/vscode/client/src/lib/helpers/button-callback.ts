import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { IDL_CLIENT_OUTPUT_CHANNEL, IDL_LOGGER } from '../initialize-client';

/**
 * Callback to handle when we have options on our buttons
 */
export async function ButtonCallback(
  res: string | undefined,
  file?: string,
  docsUrl?: string
) {
  try {
    // handle the result
    switch (true) {
      // do nothing
      case res === undefined:
        break;
      case res === IDL_TRANSLATION.debugger.logs.specifyIDLLocation:
        await vscode.commands.executeCommand(IDL_COMMANDS.CONFIG.IDL_DIR_USER);
        break;
      case res === IDL_TRANSLATION.debugger.logs.viewFile:
        if (file !== undefined) {
          await OpenFileInVSCode(file);
        }
        break;
      case res === IDL_TRANSLATION.debugger.logs.viewLogs:
        IDL_CLIENT_OUTPUT_CHANNEL.show();
        break;
      case res === IDL_TRANSLATION.notifications.viewDocs:
        await vscode.commands.executeCommand(IDL_COMMANDS.DOCS.OPEN, docsUrl);
        break;
      // do nothing
      default:
    }
  } catch (err) {
    IDL_LOGGER.log({
      type: 'error',
      content: [
        IDL_TRANSLATION.debugger.logs.buttonCallbackError,
        { res, file, err },
      ],
      alert: IDL_TRANSLATION.debugger.logs.buttonCallbackError,
    });
  }
}
