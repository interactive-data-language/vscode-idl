import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { TextDocumentChangeEvent } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { CacheValid } from '../../helpers/cache-valid';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { SendProblems } from '../../helpers/send-problems';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle new files that we open
 *
 * @param event The event from VSCode
 */
export const ON_DID_OPEN = async (
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
      content: ['File(s) opened', event.document.uri],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.document.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    // index file
    await IDL_INDEX.indexFile(info.fsPath, info.code);

    // send problems
    SendProblems([info.fsPath]);

    // remove file from memory cache
    IDL_INDEX.tokensByFile.remove(info.fsPath);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDidopen event', err],
      alert: IDL_TRANSLATION.lsp.events.onDidOpen,
    });
  }
};
