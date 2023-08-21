/**
 * Metadata for notebooks
 */
export interface IDLNotebookMetadata {
  /**
   * The ID of the cell, created when we parse a notebook and changes each
   * time we open.
   */
  id: string;
}
