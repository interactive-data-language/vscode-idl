import * as vscode from 'vscode';

type MimeTypes =
  | 'idl/notebook-renderer'
  | 'image/png'
  | 'text/html'
  | 'text/plain';

/**
 * Output for cells
 */
export interface ICompareCellOutputs {
  /** Cell we are comparing against */
  idx: number;
  /** All of the cell mimetypes */
  mimeTypes: MimeTypes[];
  /** did we succeed */
  success: boolean | undefined;
}

/**
 * Cells and their outputs
 */
export interface ICompareCellAndOutputs {
  /** Cell we are comparing against */
  idx: number;
  /** Type of cell */
  kind: vscode.NotebookCellKind;
  /** All of the cell mimetypes */
  outputs: MimeTypes[];
}
