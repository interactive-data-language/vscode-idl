import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { NotebookDocument } from 'vscode-languageserver/node';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle notebooks open
 *
 * @param notebook The notebook that we opened
 */
export const ON_DID_OPEN_NOTEBOOK = async (notebook: NotebookDocument) => {
  await SERVER_INITIALIZED;
  try {
    // // return if our cache is valid and the content has not changed
    // if (CacheValid(notebook.uri)) {
    //   return;
    // }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Notebook opened', notebook.uri],
    });

    // // get the path to the file to properly save
    // const fsPath = GetFSPath(notebook.uri);

    // // index file
    // await IDL_INDEX.indexFile(fsPath, await GetFileStrings(notebook.uri));

    // // send problems
    // SendProblems([fsPath]);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidOpenNotebook event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidOpenNotebook,
    });
  }
};
