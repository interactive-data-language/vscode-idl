import { PRO_FILE_EXTENSION, TASK_FILE_EXTENSION } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/**
 * Gets the current editor in VSCode and checks if it is a PRO file or not
 *
 * Returns undefined if no file is found
 */
export function GetActivePROCodeOrTaskWindow(
  alert = true
): vscode.TextDocument | undefined {
  // get active editor
  const editor = vscode.window.activeTextEditor;

  // check how to proceeed
  switch (true) {
    // no editor
    case !editor:
      if (alert) {
        vscode.window.showInformationMessage(
          IDL_TRANSLATION.notifications.noProCodeOrTaskFile
        );
      }
      return undefined;

    // PRO code
    case editor.document.uri.fsPath.endsWith(PRO_FILE_EXTENSION):
      return editor.document;

    // task file
    case editor.document.uri.fsPath.endsWith(TASK_FILE_EXTENSION):
      return editor.document;

    // nothing we care about
    default:
      if (alert) {
        vscode.window.showInformationMessage(
          IDL_TRANSLATION.notifications.noProCodeOrTaskFile
        );
      }
      return undefined;
  }
}
