import { IDL_NOTEBOOK_LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/**
 * Gets the current notebook editor in VSCode and checks if it is an IDL Notebook or not
 *
 * Returns undefined if no file is found
 */
export function GetActiveIDLNotebookWindow(
  alert = true
): vscode.NotebookDocument | undefined {
  // get active editor
  const editor = vscode.window.activeNotebookEditor;

  // check how to proceed
  switch (true) {
    // no editor
    case !editor:
      if (alert) {
        vscode.window.showInformationMessage(
          IDL_TRANSLATION.notifications.noIDLNotebook
        );
      }
      return undefined;

    // IDL notebook
    case editor.notebook.notebookType === IDL_NOTEBOOK_LANGUAGE_NAME:
      return editor.notebook;

    // nothing we care about
    default:
      if (alert) {
        vscode.window.showInformationMessage(
          IDL_TRANSLATION.notifications.noProCode
        );
      }
      return undefined;
  }
}
