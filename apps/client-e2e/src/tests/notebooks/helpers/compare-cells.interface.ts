import * as vscode from 'vscode';

type MimeTypes =
  | 'text/html'
  | 'text/plain'
  | 'image/png'
  | 'idl/notebook-renderer';

/**
 * Output for cells
 */
export interface ICompareCellOutputs {
  /** Cell we are comparing against */
  idx: number;
  /** did we succeed */
  success: boolean | undefined;
  /** All of the cell mimetypes */
  mimeTypes: MimeTypes[];
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
