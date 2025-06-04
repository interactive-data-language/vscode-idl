import { IDLFileHelper } from '@idl/idl/files';
import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/**
 * Gets the current editor in VSCode and checks if it is a PRO file or not
 *
 * Returns undefined if no file is found
 */
export function GetActivePROCodeOrTaskWindow(
  alert = true,
  allFiles = false
): undefined | vscode.TextDocument {
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
    case IDLFileHelper.isPROCode(editor.document.uri.fsPath):
      return editor.document;

    // PRO def file
    case IDLFileHelper.isPRODef(editor.document.uri.fsPath):
      return editor.document;

    // task file
    case IDLFileHelper.isTaskFile(editor.document.uri.fsPath):
      return editor.document;

    // idl.json
    case allFiles && IDLFileHelper.isConfigFile(editor.document.uri.fsPath):
      return editor.document;

    // IDL package file
    case allFiles && IDLFileHelper.isIDLPackageFile(editor.document.uri.fsPath):
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
