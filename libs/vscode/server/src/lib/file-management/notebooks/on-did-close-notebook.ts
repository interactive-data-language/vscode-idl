import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { NotebookDocument } from 'vscode-languageserver/node';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';
import { SendNotebookProblems } from './send-notebook-problems';

/**
 * Callback to handle notebooks being closed
 *
 * Just like text documents, we re-parse because they have
 * had unsaved changes on closed, so we might need the text
 * on disk.
 *
 * @param notebook The notebook from VSCode
 */
export const ON_DID_CLOSE_NOTEBOOK = async (notebook: NotebookDocument) => {
  await SERVER_INITIALIZED;
  try {
    // // return if our cache is valid and the content has not changed
    // if (NotebookCacheValid(notebook)) {
    //   return;
    // }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Notebook closed', notebook.uri],
    });

    // get the path to the file to properly save
    const fsPath = GetFSPath(notebook.uri);

    // remove notebook from cache
    await IDL_INDEX.removeNotebook(fsPath);

    // send empty problems
    SendNotebookProblems(notebook);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidCloseNotebook event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidCloseNotebook,
    });
  }
};
