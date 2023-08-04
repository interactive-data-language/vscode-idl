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
      const doc = manager.getCellTextDocument(cell);
      return {
        ...cell,
        /**
         * Verify doc exists, there was some odd error that it didn't on close
         * so not sure what that was about
         */
        text: doc !== undefined ? doc.getText() : '',
      };
    }),
  };
}
