import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  DocumentSymbol,
  DocumentSymbolParams,
  SymbolInformation,
} from 'vscode-languageserver/node';

import { GetFileStrings } from '../../helpers/get-file-strings';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-file-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle requesting the outline (i.e. "document symbol") request
 */
export const ON_DOCUMENT_SYMBOL = async (
  event: DocumentSymbolParams
): Promise<SymbolInformation[] | DocumentSymbol[]> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Document symbol request', event],
    });

    // get the path to the file to properly save
    const fsPath = GetFSPath(event.textDocument.uri);

    // do nothing
    if (!IDL_INDEX.isPROCode(fsPath)) {
      return undefined;
    }

    // get and return our symbols
    return await IDL_INDEX.getOutline(
      fsPath,
      await GetFileStrings(event.textDocument.uri)
    );
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
