import * as vscode from 'vscode';

/**
 * Open notebook document and show it
 */
export async function OpenNotebookInVSCode(file: string, show = true) {
  const uri = vscode.Uri.file(file);
  const doc = await vscode.workspace.openNotebookDocument(uri);
  if (show) {
    await vscode.window.showNotebookDocument(doc);
  }
  return doc;
}
