import { IDLEvaluateOptions } from '@idl/types/idl/idl-process';
import { PrepareNotebookCellResponse } from '@idl/vscode/events/messages';
import * as vscode from 'vscode';

/**
 * Current cell we are executing
 */
export interface ICurrentCell {
  /** Cell being executed */
  cell: vscode.NotebookCell;
  /** Cell execution */
  execution: vscode.NotebookCellExecution;
  /** Are we done processing? */
  finished: boolean;
  /** Currently captured output */
  output: string;
  /** Prepared notebook cell */
  prepared?: PrepareNotebookCellResponse;
  /** Did we succeed or not */
  success: boolean;
}

/**
 * Actions we take at the end of a notebook cell being executed
 */
export interface IEndCellExecutionActions {
  decorateStack?: boolean;
  /**
   * Do we try to add any graphics
   */
  postExecute?: boolean;
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
