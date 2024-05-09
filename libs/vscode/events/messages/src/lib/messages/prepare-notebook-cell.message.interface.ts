/** Prepare notebook cell for execution */
export type PrepareNotebookCellMessage = 'prepare-notebook-cell';

/*
 * Payload to convert a notebook cell to code we can run
 */
export interface PrepareNotebookCellPayload {
  /** URI for the parent notebook */
  notebookUri: string;
  /** URI for the cell */
  cellUri: string;
}

/*
 * Response when converting a notebook cell to code we can run
 */
export interface PrepareNotebookCellResponse {
  /** New file contents */
  text: string;
  /**
   * The number of lines we added to the cell to make sure
   * we properly track where we are when we stop or potentially add breakpoints
   * in the future
   */
  offset: number;
}
