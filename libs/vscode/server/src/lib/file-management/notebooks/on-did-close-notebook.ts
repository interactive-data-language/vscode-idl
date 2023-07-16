import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { NotebookDocument } from 'vscode-languageserver/node';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle notebooks being closed
 *
 * @param notebook The notebook from VSCode
 */
export const ON_DID_CLOSE_NOTEBOOK = async (notebook: NotebookDocument) => {
  await SERVER_INITIALIZED;
  try {
    // // return if our cache is valid and the content has not changed
    // if (CacheValid(notebook.uri)) {
    //   return;
    // }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Notebook closed', notebook.uri],
    });

    // // get the path to the file to properly save
    // const fsPath = GetFSPath(notebook.uri);
    // /**
    //  * When we close a file, always re-parse it
    //  *
    //  * Why you ask? Because, when you edit code, you can make changes that are
    //  * not saved.
    //  *
    //  * For example: I open a PRO file, change routine definitions, and close the file
    //  * *without* saving, then we need to trigger a parse with the code on disk.
    //  *
    //  * This is because, as you make changes, we parse on the fly. So we need to trigger
    //  * a re-parse and run change detection using the globals in the file stored on disk
    //  */
    // await IDL_INDEX.indexFile(fsPath, await GetFileStrings(notebook.uri));
    // // send problems
    // SendProblems([fsPath]);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidCloseNotebook event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidCloseNotebook,
    });
  }
};
