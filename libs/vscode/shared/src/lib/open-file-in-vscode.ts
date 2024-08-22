import * as vscode from 'vscode';

/**
 * Taking a traditional filepath, this routine will open the file
 * in the VSCode editor and, by default, show the window
 */
export async function OpenFileInVSCode(
  file: string,
  show = true,
  bySide = false
) {
  const uri = vscode.Uri.file(file);
  const doc = await vscode.workspace.openTextDocument(uri);
  if (show) {
    /**
     * Get all tab groups
     */
    const groups = vscode.window.tabGroups.all;

    /**
     * One-based index for active editor
     */
    let column: vscode.ViewColumn = vscode.ViewColumn.Beside;

    // determine how to open
    switch (true) {
      case groups.length === 1:
        break;
      case groups.length > 1:
        {
          // find active tab group
          const active =
            groups.findIndex(
              (group) => group === vscode.window.tabGroups.activeTabGroup
            ) + 1;

          // if active is not the first, show in the first
          if (active > 1) {
            column = (active - 1) as vscode.ViewColumn;
          }
        }
        break;
      default:
        break;
    }

    await vscode.window.showTextDocument(
      doc,
      bySide
        ? {
            viewColumn: column,
            preserveFocus: false,
          }
        : { preserveFocus: false }
    );
  }
  return doc;
}

/**
 * From a URI, opens a file in VSCode
 */
export async function OpenFileInVSCodeFromURI(uri: vscode.Uri, show = true) {
  const doc = await vscode.workspace.openTextDocument(uri);
  if (show) {
    await vscode.window.showTextDocument(doc);
  }
  return doc;
}
