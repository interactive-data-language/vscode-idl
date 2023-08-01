import * as vscode from 'vscode';

import { ICurrentCell } from '../idl-notebook-controller.interface';

/**
 * Adds an image to a cell
 */
export function AddImageToCell(
  cell: ICurrentCell,
  encoded: string,
  width: number,
  height: number
) {
  /**
   * Styles for the element to fil the space, but not exceed 1:1 dimensions
   */
  const style = `style="width:100%;height:auto;max-width:${width}px;max-height:${height}px;aspect-ratio:1;"`;

  // add as output
  cell.execution.appendOutput(
    new vscode.NotebookCellOutput([
      /**
       * Use HTML because it works. Using the other mimetype *probably* works
       * but this works right now :)
       */
      new vscode.NotebookCellOutputItem(
        Buffer.from(`<img src="data:image/png;base64,${encoded}" ${style}/>`),
        'text/html'
      ),
    ])
  );
}
