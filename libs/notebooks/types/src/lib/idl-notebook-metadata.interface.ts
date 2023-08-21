/**
 * Metadata tags we dont save, we also need to create these after we
 * parse a notebook so that metadata is consistent
 */
export const NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE = ['id'];

/**
 * Metadata for notebook cell outputs
 */
export interface IDLNotebookOutputMetadata {
  /**
   * The ID of the cell, created when we parse a notebook and changes each
   * time we open.
   */
  id: string;
}
