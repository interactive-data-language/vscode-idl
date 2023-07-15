/**
 * The version of our IDL notebook files
 */
export type IDLNotebookVersion = '1.0.0';

/**
 * Data structure for notebook cells
 *
 * DO NOT CHANGE PROPERTY NAMES AS THIS BREAKS PARSING
 */
export interface RawNotebookCell {
  /**
   * The type of cell
   */
  type: 'code' | 'markdown';
  /**
   * Content of the cell
   */
  content: string[];
}

/**
 * Data structure for IDL notebooks (using VSCode example)
 *
 * DO NOT CHANGE PROPERTY NAMES AS THIS BREAKS PARSING
 */
export interface RawNotebook {
  /**
   * Version of the notebook so that, if we change the data structure, we have a
   * property to key off of for migration
   */
  version: IDLNotebookVersion;
  /**
   * The cells within the notebook
   */
  cells: RawNotebookCell[];
}

/**
 * Default notebook contents in case we have an empty file
 */
export const DEFAULT_NOTEBOOK: RawNotebook = {
  version: '1.0.0',
  cells: [],
};

/**
 * Default stringified notebook
 */
export const DEFAULT_SERIALIZED_NOTEBOOK = JSON.stringify(DEFAULT_NOTEBOOK);
