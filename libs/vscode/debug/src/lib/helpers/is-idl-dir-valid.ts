import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { existsSync } from 'fs';
import * as vscode from 'vscode';

/**
 * Checks if the configured IDL directory is valid and returns a boolean flag
 * if it is not
 */
export function IsIDLDirValid(dir: string): boolean {
  // verify that we have the right info, otherwise alert, terminate, and return
  if (dir === '' || !existsSync(dir)) {
    vscode.window
      .showInformationMessage(IDL_TRANSLATION.notifications.noIDLDirFound, {
        title: IDL_TRANSLATION.notifications.configure,
      })
      .then((res) => {
        if (res !== undefined) {
          if (res.title === IDL_TRANSLATION.notifications.configure) {
            vscode.commands.executeCommand(IDL_COMMANDS.CONFIG.IDL_DIR_USER);
          }
        }
      });

    // return and dont continue
    return false;
  }

  return true;
}
