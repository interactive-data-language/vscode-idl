import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { NotebookDocumentChangeEvent } from 'vscode-languageserver/lib/common/notebook';

import { NotebookCacheValid } from '../../helpers/notebook-cache-valid';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { SERVER_INITIALIZED } from '../is-initialized';

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

    // // get the path to the file to properly save
    // const fsPath = GetFSPath(event.document.uri);

    // // re-index our file
    // await IDL_INDEX.indexFile(fsPath, await GetFileStrings(event.document.uri));

    // // send problems
    // SendProblems([fsPath]);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidChangeNotebook event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidChangeNotebook,
    });
  }
};
