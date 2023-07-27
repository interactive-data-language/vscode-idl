import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { VSCODE_COMMANDS } from '@idl/vscode/shared';
import copy from 'fast-copy';
import * as vscode from 'vscode';

import { DEFAULT_IDL_DEBUG_CONFIGURATION } from '../idl-debug-adapter.interface';
import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';

/**
 * Starts debugging session of IDL
 */
export async function StartIDL(): Promise<boolean> {
  // return if we have started
  if (IsIDLStarted()) {
    // display debug window if already started
    vscode.commands.executeCommand(VSCODE_COMMANDS.SHOW_DEBUG_CONSOLE);
    // vscode.window.showInformationMessage(
    //   IDL_TRANSLATION.debugger.idl.alreadyStarted
    // );
    return true;
  }

  // make sure we have a folder
  if (!IDL_EXTENSION_CONFIG.IDL.directory) {
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
    return false;
  }

  // check for active debugging
  if (vscode.debug.activeDebugSession !== undefined) {
    vscode.window.showInformationMessage(
      IDL_TRANSLATION.debugger.idl.existingSessionFound
    );
    return false;
  }

  // check for a workspace folder
  let folder: vscode.WorkspaceFolder;

  // verify we have a workspace folder opened
  if (vscode.workspace.workspaceFolders !== undefined) {
    // get the folder that we are opening for debugging (first)
    folder =
      vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0]
        : undefined;
  }

  // attempt to start debugging
  vscode.commands.executeCommand(VSCODE_COMMANDS.SHOW_DEBUG_CONSOLE);

  // launch the debug configuration
  await vscode.debug.startDebugging(
    folder,
    copy(DEFAULT_IDL_DEBUG_CONFIGURATION)
  );

  // return that IDL has started
  return true;
}

/**
 * Checks if IDL is started
 */
export function IsIDLStarted(): boolean {
  return IDL_DEBUG_ADAPTER.isStarted();
}

/**
 * makes sure our session of IDL has started.
 *
 * Optionally alert user that they need to start a debug session of IDL
 */
export function VerifyIDLHasStarted(alert = true): boolean {
  // get IDL session
  const started = IsIDLStarted();

  // check if we havent started and should alert user
  if (!started && alert) {
    vscode.window
      .showInformationMessage(IDL_TRANSLATION.debugger.idl.pleaseStart, {
        title: IDL_TRANSLATION.notifications.start,
      })
      .then(
        async (resp) => {
          // handle dialog closed with "x"
          if (resp === undefined) {
            return;
          }

          // otherwise check user response
          switch (resp.title) {
            case IDL_TRANSLATION.notifications.start:
              try {
                await StartIDL();
              } catch (err) {
                console.log(err);
              }
              break;
            default:
              break;
          }
        },
        (err) => {
          if (err?.message === 'Canceled') {
            return;
          }
          console.error(err);
        }
      );
    return undefined;
  }

  return started;
}
