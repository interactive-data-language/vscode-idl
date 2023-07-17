import copy from 'fast-copy';
import { NotebookDocument, NotebookDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { IDLNotebookDocument } from './idl-notebook-document.interface';

/**
 * Converts a notebook document to an IDL Notebook Document which contains
 * the text.
 */
export function NotebookToIDLNotebook(
  notebook: NotebookDocument,
  manager: NotebookDocuments<TextDocument>
): IDLNotebookDocument {
  /** Copy so we dont muck up date */
  const copied = copy(notebook);

  // return and map cells
  return {
    ...copied,
    cells: copied.cells.map((cell) => {
      return {
        ...cell,
        text: manager.getCellTextDocument(cell).getText(),
      };
    }),
  };
}
