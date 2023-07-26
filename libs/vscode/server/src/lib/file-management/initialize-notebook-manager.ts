import { NotebookDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { SERVER_CONNECTION } from '../initialize-server';
import { ON_DID_CHANGE_NOTEBOOK } from './notebooks/on-did-change-notebook';
import { ON_DID_CLOSE_NOTEBOOK } from './notebooks/on-did-close-notebook';
import { ON_DID_OPEN_NOTEBOOK } from './notebooks/on-did-open-notebook';

/**
 * Text document manager which handles full document syncs
 */
export const NOTEBOOK_MANAGER: NotebookDocuments<TextDocument> =
  new NotebookDocuments(TextDocument);

/**
 * Initializes events for notebooks and registers callbacks
 *
 * All events need manual try/catch as they crash the server with uncaught promises without
 */
export function InitializeNotebookManager() {
  // listen for notebooks opening
  NOTEBOOK_MANAGER.onDidOpen(async (ev) => {
    try {
      await ON_DID_OPEN_NOTEBOOK(ev);
    } catch (err) {
      // do nothing, handled elsewhere
    }
  });

  // listen for document changes
  NOTEBOOK_MANAGER.onDidChange(async (ev) => {
    try {
      await ON_DID_CHANGE_NOTEBOOK(ev);
    } catch (err) {
      // do nothing, handled elsewhere
    }
  });

  // listen for notebooks being closed
  NOTEBOOK_MANAGER.onDidClose(async (ev) => {
    try {
      await ON_DID_CLOSE_NOTEBOOK(ev);
    } catch (err) {
      // do nothing, handled elsewhere
    }
  });

  // NOTEBOOK_MANAGER.onDidSave((ev) => {
  //   console.log('Saved', ev);
  // });

  // LISTEN FOR EVENTS
  NOTEBOOK_MANAGER.listen(SERVER_CONNECTION);
}
