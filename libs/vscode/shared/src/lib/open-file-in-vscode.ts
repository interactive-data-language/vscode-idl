import * as vscode from 'vscode';

/**
 * Taking a traditional filepath, this routine will open the file
 * in the VSCode editor and, by default, show the window
 */
export async function OpenFileInVSCode(file: string, show = true) {
  const uri = vscode.Uri.file(file);
  const doc = await vscode.workspace.openTextDocument(uri);
  if (show) {
    await vscode.window.showTextDocument(doc);
  }
  return doc;
}
