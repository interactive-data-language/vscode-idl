import { NotebookCellOutput } from 'vscode';

/**
 * The version of our IDL notebook files
 */
export type IDLNotebookVersion = '1.0.0';

/**
 * The type of cell for our markdown files
 */
export type IDLNotebookCellType = 'code' | 'markdown';

/**
 * Data structure for notebook cells
 *
 * DO NOT CHANGE PROPERTY NAMES AS THIS BREAKS PARSING
 */
export interface RawNotebookCell {
  /**
   * The type of cell
   */
  type: IDLNotebookCellType;
  /**
   * Content of the cell
   */
  content: string[];
  /**
   * Notebook cell metadata
   */
  metadata?: { [key: string]: any };
  /**
   * Output data for our cell
   *
   * TODO: Do we need our own format in case VSCode changes this data structure??
   */
  outputs?: NotebookCellOutput[];
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
  /**
   * Notebook metadata
   */
  metadata?: { [key: string]: any };
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
