import { IDLEvaluateOptions } from '@idl/idl';
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

/**
 * Actions we take at the end of a notebook cell being executed
 */
export interface IEndCellExecutionActions {
  /**
   * Do we try to add any graphics
   */
  postExecute?: boolean;
  decorateStack?: boolean;
}

/**
 * What do we do at the end of notebook cell execution?
 */
export const DEFAULT_END_CELL_EXECUTION_ACTIONS: IEndCellExecutionActions = {
  postExecute: true,
  decorateStack: false,
};

/**
 * Default options to run IDL code
 */
export const DEFAULT_NOTEBOOK_EVALUATE_OPTIONS: IDLEvaluateOptions = {
  echo: false,
  idlInfo: false,
  cut: false,
  silent: false,
};
