import * as vscode from 'vscode';

/**
 * Open notebook document and show it
 */
export async function OpenNotebookInVSCode(
  file: string,
  show = true,
  bySide = false
) {
  const uri = vscode.Uri.file(file);
  const doc = await vscode.workspace.openNotebookDocument(uri);
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

    await vscode.window.showNotebookDocument(
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
