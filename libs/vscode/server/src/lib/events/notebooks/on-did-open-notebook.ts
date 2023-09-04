import { IDL_LSP_LOG } from '@idl/logger';
import { NotebookToIDLNotebook } from '@idl/notebooks/shared';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { NotebookDocument } from 'vscode-languageserver/node';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { NOTEBOOK_MANAGER } from '../initialize-notebook-manager';
import { SERVER_INITIALIZED } from '../is-initialized';
import { SendNotebookProblems } from './send-notebook-problems';

/**
 * Callback to handle notebooks open
 *
 * @param notebook The notebook that we opened
 */
export const ON_DID_OPEN_NOTEBOOK = async (notebook: NotebookDocument) => {
  await SERVER_INITIALIZED;
  try {
    /**
     * Always re-parse when we open a notebook in case it changed (i.e. vscode or we dont quite catch git updates)
     */
    // // return if our cache is valid and the content has not changed
    // if (NotebookCacheValid(notebook)) {
    //   return;
    // }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Notebook opened', notebook.uri],
    });

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
      content: ['Error responding to onDidOpenNotebook event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidOpenNotebook,
    });
  }
};
