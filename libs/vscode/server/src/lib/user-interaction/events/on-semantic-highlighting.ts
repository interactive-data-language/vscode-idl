import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  SemanticTokens,
  SemanticTokensParams,
} from 'vscode-languageserver/node';

import { IDL_INDEX } from '../../file-management/initialize-document-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';

/**
 * Event handler for adding sematic highlighting
 */
export const ON_SEMANTIC_HIGHLIGHTING = async (
  params: SemanticTokensParams
): Promise<SemanticTokens> => {
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Semantic tokens request', params],
    });

    // get the path to the file to properly save
    const fsPath = GetFSPath(params.textDocument.uri);

    // do nothing
    if (!IDL_INDEX.isPROCode(fsPath)) {
      return undefined;
    }

    // get sematic tokens
    const tokens = await IDL_INDEX.getSemanticTokens(
      fsPath,
      await GetFileStrings(params.textDocument.uri)
    );

    // remove from our main thread lookup
    IDL_INDEX.tokensByFile.remove(fsPath);

    // return
    return tokens;
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to semantic highlighting request', err],
      alert: IDL_TRANSLATION.lsp.events.onSemanticHighlighting,
    });
    return undefined;
  }
};
