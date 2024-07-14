import * as vscode from 'vscode';

/**
 * For a given URI, attempts to get a matching text editor
 *
 * Returns undefined if no editor is found (i.e. file not open)
 */
export function GetTextEditorForURIString(
  uriString: string
): vscode.TextEditor | undefined {
  // return current editor
  return vscode.window.visibleTextEditors.filter(
    (editor) => editor.document.uri.toString() === uriString
  )[0];
}

/**
 * For a given URI, attempts to get a matching text editor
 *
 * Returns undefined if no editor is found (i.e. file not open)
 */
export function GetTextEditorForURI(
  uri: vscode.Uri
): vscode.TextEditor | undefined {
  // return current editor
  return GetTextEditorForURIString(uri.toString());
}
