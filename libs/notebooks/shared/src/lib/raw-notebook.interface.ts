import { EncodeNotebookCellContent } from './encode-notebook-cell-content';

/**
 * The version of our IDL notebook files
 */
export type IDLNotebookVersion = '1.0.0';

/**
 * The type of cell for our markdown files
 */
export type IDLNotebookCellType = 'code' | 'markdown';

/**
 * Raw notebook cell outputs
 */
export interface RawNotebookCellOutputItem {
  /** type of output */
  mime: string;
  /** Base 64 encoded string of binary data */
  data: string;
}

/**
 * Raw notebook cell outputs
 */
export interface RawNotebookCellOutput {
  /** Output Items */
  items: RawNotebookCellOutputItem[];
  /**
   * Notebook cell metadata
   */
  metadata?: { [key: string]: any };
}

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
   * Content of the cell, base64 encoded string
   */
  content: string;
  /**
   * Notebook cell metadata
   */
  metadata?: { [key: string]: any };
  /**
   * Output data for our cell
   *
   * TODO: Do we need our own format in case VSCode changes this data structure??
   */
  outputs?: RawNotebookCellOutput[];
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
  cells: [
    {
      type: 'markdown',
      content: EncodeNotebookCellContent(
        [
          '### Notebook Preview',
          '',
          'Please note that this is a preview feature of notebooks for IDL.',
          '',
          "Our Notebook API and file format are not set in stone, so please don't start creating many notebooks for personal use quite yet.",
          '',
          'Use the examples from documentation as a way to learn about how to use notebooks and see if you like them!',
          '',
          'If you have questions, comments, or concerns, let us know [here](https://github.com/interactive-data-language/vscode-idl/discussions/6) on GitHub.',
        ].join('\n')
      ),
    },
  ],
};

/**
 * Default stringified notebook
 */
export const DEFAULT_SERIALIZED_NOTEBOOK = JSON.stringify(DEFAULT_NOTEBOOK);
