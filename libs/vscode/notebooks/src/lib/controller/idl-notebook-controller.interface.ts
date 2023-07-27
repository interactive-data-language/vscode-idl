import * as vscode from 'vscode';

/**
 * Current cell we are executing
 */
export interface ICurrentCell {
  /** Cell being executed */
  cell: vscode.NotebookCell;
  /** Cell execution */
  execution: vscode.NotebookCellExecution;
  /** Currently captured output */
  output: string;
  /** Are we done processing? */
  finished: boolean;
  /** Did we succeed or not */
  success: boolean;
}
