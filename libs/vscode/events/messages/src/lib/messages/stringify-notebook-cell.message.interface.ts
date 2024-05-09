/** Message to convert a notebook cell to code that we can run */
export type StringifyNotebookCellMessage = 'stringify-notebook-cell';

/*
 * Payload to convert a notebook cell to code we can run
 */
export interface StringifyNotebookCellPayload {
  /** URI for the notebook cell we are migrating */
  uri: string;
}

/*
 * Response when converting a notebook cell to code we can run
 */
export interface StringifyNotebookCellResponse {
  /** New file contents */
  text: string;
  /**
   * The number of lines we added to the cell to make sure
   * we properly track where we are when we stop or potentially add breakpoints
   * in the future
   */
  offset: number;
}
