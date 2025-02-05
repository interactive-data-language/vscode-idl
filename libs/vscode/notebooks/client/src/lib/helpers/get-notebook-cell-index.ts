import * as vscode from 'vscode';

/**
 * Returns the notebook and the cell index that we selected
 */
export function GetNotebookCellIndex(cellDoc: vscode.TextDocument) {
  /** Notebook document that we are in */
  const notebook = vscode.window.activeNotebookEditor.notebook;

  // return if no notebook
  if (notebook === undefined) {
    return;
  }

  /** Index of the cell */
  let cell: number;

  /**
   * Get the cells in our document
   */
  const cells = notebook.getCells();

  // check if they are the same
  for (let j = 0; j < cells.length; j++) {
    if (cells[j].document === cellDoc) {
      cell = j;
      break;
    }
  }

  // make sure we have the cell
  if (cell === undefined) {
    return undefined;
  }

  return { notebook, cell };
}
