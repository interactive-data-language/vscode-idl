import { NotebookCell, NotebookDocument } from 'vscode-languageserver';

/**
 * Custom type for notebook cells which bring along they text they contain
 */
export interface IDLNotebookCells extends NotebookCell {
  /**
   * The actual text within the cell
   */
  text: string;
}

/**
 * Custom notebook type that contains extra metadata in the cells
 */
export interface IDLNotebookDocument extends NotebookDocument {
  /**
   * Cells that also contain the text within
   */
  cells: IDLNotebookCells[];
}
