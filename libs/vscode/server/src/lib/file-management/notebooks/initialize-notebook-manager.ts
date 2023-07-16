import { NotebookDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { SERVER_CONNECTION } from '../../initialize-server';

/**
 * Text document manager which handles full document syncs
 */
export const NOTEBOOK_MANAGER: NotebookDocuments<TextDocument> =
  new NotebookDocuments(TextDocument);

/**
 * Initializes events for notebooks and registers callbacks
 */
export function InitializeNotebookManager() {
  NOTEBOOK_MANAGER.onDidChange((ev) => {
    console.log('Changed', ev);
  });

  NOTEBOOK_MANAGER.onDidClose((ev) => {
    console.log('Closed', ev);
  });

  NOTEBOOK_MANAGER.onDidOpen((ev) => {
    console.log('Opened', ev);
  });

  NOTEBOOK_MANAGER.onDidSave((ev) => {
    console.log('Saved', ev);
  });

  // LISTEN FOR EVENTS
  NOTEBOOK_MANAGER.listen(SERVER_CONNECTION);
}
