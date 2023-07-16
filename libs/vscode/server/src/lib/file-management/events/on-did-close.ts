import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { TextDocumentChangeEvent } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { CacheValid } from '../../helpers/cache-valid';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { SendProblems } from '../../helpers/send-problems';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle files being closed
 *
 * Do nothing with this for now, apart from listen for the event
 *
 * @param event The event from VSCode
 */
export const ON_DID_CLOSE = async (
  event: TextDocumentChangeEvent<TextDocument>
) => {
  await SERVER_INITIALIZED;
  try {
    // return if our cache is valid and the content has not changed
    if (CacheValid(event.document.uri)) {
      return;
    }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['File closed', event.document.uri],
    });
    // get the path to the file to properly save
    const fsPath = GetFSPath(event.document.uri);

    /**
     * When we close a file, always re-parse it
     *
     * Why you ask? Because, when you edit code, you can make changes that are
     * not saved.
     *
     * For example: I open a PRO file, change routine definitions, and close the file
     * *without* saving, then we need to trigger a parse with the code on disk.
     *
     * This is because, as you make changes, we parse on the fly. So we need to trigger
     * a re-parse and run change detection using the globals in the file stored on disk
     */
    await IDL_INDEX.indexFile(fsPath, await GetFileStrings(event.document.uri));

    // send problems
    SendProblems([fsPath]);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to closed documents', err],
      alert: IDL_TRANSLATION.lsp.events.onDidClose,
    });
  }
};
