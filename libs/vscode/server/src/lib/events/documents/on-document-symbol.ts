import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  DocumentSymbol,
  DocumentSymbolParams,
} from 'vscode-languageserver/node';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle requesting the outline (i.e. "document symbol") request
 */
export const ON_DOCUMENT_SYMBOL = async (
  event: DocumentSymbolParams
): Promise<DocumentSymbol[]> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Document symbol request', event],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    // get and return our symbols
    const outline = await IDL_INDEX.getOutline(
      info.fsPath,
      info.code,
      new CancellationToken()
    );

    // remove file from memory cache
    IDL_INDEX.tokensByFile.remove(info.fsPath);

    // return outline
    return outline;
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDocumentSymbol event', err],
      alert: IDL_TRANSLATION.lsp.events.onDocumentSymbol,
    });
    return [];
  }
};
