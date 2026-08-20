/**
 * Result of preparing IDL code for execution.
 *
 * Matches the shape of `PrepareNotebookCellResponse` but is
 * defined here to avoid pulling in VSCode event message types.
 */
export interface IPrepareIDLCodeResult {
  /** Content to write to disk */
  code: string;
  /** Code without print statements for reporting errors */
  codeWithoutPrint: string;
  /** If the main level program is empty */
  emptyMain: boolean;
  /** Do we have a main level program */
  hasMain: boolean;
  /** Are we a batch file? */
  isBatch: boolean;
  /** Number of lines added to the cell */
  offset: number;
}

/**
 * Callback that prepares raw IDL code for execution.
 *
 * In VS Code this delegates to the language server; in standalone
 * mode it can use the worker/indexer directly.
 *
 * Returns `undefined` if preparation failed.
 */
export type PrepareIDLCodeCallback = (
  code: string,
) => Promise<IPrepareIDLCodeResult | undefined>;
