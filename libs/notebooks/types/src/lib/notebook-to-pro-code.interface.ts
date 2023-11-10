/**
 * Options when creating IDL Notebook
 */
export interface INotebookToProCodeOptions {
  /**
   * If set, include all cells in the PRO file
   */
  includeAllCells: boolean;
}

/**
 * Default options for converting our notebook to PRO code
 */
export const DEFAULT_NOTEBOOK_TO_PRO_CODE_OPTIONS: INotebookToProCodeOptions = {
  includeAllCells: true,
};
