import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { TextDocumentChangeEvent } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { CacheValid } from '../../helpers/cache-valid';
import { IsURIFile } from '../../helpers/is-uri-file';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { SendProblems } from '../../helpers/send-problems';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle files being closed
 *
 * @param event The event from VSCode
 */
export const ON_DID_CLOSE = async (
  event: TextDocumentChangeEvent<TextDocument>
) => {
  await SERVER_INITIALIZED;
  try {
    // if we had a temporary file, return
    if (!IsURIFile(event.document.uri)) {
      return;
    }

    // return if our cache is valid and the content has not changed
    if (CacheValid(event.document.uri)) {
      return;
    }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['File closed', event.document.uri],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.document.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

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
    await IDL_INDEX.indexFile(info.fsPath, info.code);

    // send problems
    SendProblems([info.fsPath]);

    // remove file from memory cache
    IDL_INDEX.tokensByFile.remove(info.fsPath);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to closed documents', err],
      alert: IDL_TRANSLATION.lsp.events.onDidClose,
    });
  }
};
