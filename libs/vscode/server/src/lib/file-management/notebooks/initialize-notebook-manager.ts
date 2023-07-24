import { NotebookDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { SERVER_CONNECTION } from '../../initialize-server';
import { ON_DID_CHANGE_NOTEBOOK } from './on-did-change-notebook';
import { ON_DID_CLOSE_NOTEBOOK } from './on-did-close-notebook';
import { ON_DID_OPEN_NOTEBOOK } from './on-did-open-notebook';

/**
 * Text document manager which handles full document syncs
 */
export const NOTEBOOK_MANAGER: NotebookDocuments<TextDocument> =
  new NotebookDocuments(TextDocument);

/**
 * Initializes events for notebooks and registers callbacks
 */
export function InitializeNotebookManager() {
  // listen for notebooks opening
  NOTEBOOK_MANAGER.onDidOpen(ON_DID_OPEN_NOTEBOOK);

  // listen for document changes
  NOTEBOOK_MANAGER.onDidChange(ON_DID_CHANGE_NOTEBOOK);

  // listen for notebooks being closed
  NOTEBOOK_MANAGER.onDidClose(ON_DID_CLOSE_NOTEBOOK);

  // NOTEBOOK_MANAGER.onDidSave((ev) => {
  //   console.log('Saved', ev);
  // });

  // LISTEN FOR EVENTS
  NOTEBOOK_MANAGER.listen(SERVER_CONNECTION);
}
