import { IDL_LSP_LOG } from '@idl/logger';
import { NotebookToIDLNotebook } from '@idl/notebooks/shared';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { NotebookDocumentChangeEvent } from 'vscode-languageserver/lib/common/notebook';

import { NotebookCacheValid } from '../../helpers/notebook-cache-valid';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { NOTEBOOK_MANAGER } from '../initialize-notebook-manager';
import { SERVER_INITIALIZED } from '../is-initialized';
import { SendNotebookProblems } from './send-notebook-problems';

/**
 * Callback to handle notebook changes
 *
 * TODO: work with just the changed parts of a notebook
 *
 * @param event The event from VSCode
 */
export const ON_DID_CHANGE_NOTEBOOK = async (
  event: NotebookDocumentChangeEvent
) => {
  await SERVER_INITIALIZED;
  try {
    // return if our cache is valid and the content has not changed
    if (NotebookCacheValid(event.notebookDocument)) {
      return;
    }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Notebook changed', event.notebookDocument.uri],
    });

    /**
     * Get notebook document
     */
    const notebook = event.notebookDocument;

    /**
     * Get text for all cells for quick access
     */
    const idlNotebook = NotebookToIDLNotebook(notebook, NOTEBOOK_MANAGER);

    // get the path to the file to properly save
    const fsPath = GetFSPath(notebook.uri);

    // index file
    await IDL_INDEX.parseAndTrackNotebook(fsPath, idlNotebook);

    // send problems
    SendNotebookProblems(notebook);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidChangeNotebook event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidChangeNotebook,
    });
  }
};
