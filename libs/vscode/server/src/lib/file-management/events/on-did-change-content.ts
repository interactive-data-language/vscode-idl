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
 * Callback to handle file changes
 *
 * TODO: work with just the changed parts of a document
 *
 * @param event The event from VSCode
 */
export const ON_DID_CHANGE_CONTENT = async (
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
      content: ['Changed content', event.document.uri],
    });

    // get the path to the file to properly save
    const fsPath = GetFSPath(event.document.uri);

    // re-index our file
    await IDL_INDEX.indexFile(fsPath, await GetFileStrings(event.document.uri));

    // send problems
    SendProblems([fsPath]);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidopen event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidChangeContent,
    });
  }
};
