import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDLFileHelper, GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  SemanticTokens,
  SemanticTokensParams,
} from 'vscode-languageserver/node';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Event handler for adding sematic highlighting
 */
export const ON_SEMANTIC_HIGHLIGHTING = async (
  params: SemanticTokensParams
): Promise<SemanticTokens> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Semantic tokens request', params],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(params.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    // return if not a file we can process
    if (
      !(
        IDLFileHelper.isPROCode(info.fsPath) ||
        IDLFileHelper.isIDLNotebookFile(info.fsPath)
      )
    ) {
      return undefined;
    }

    // get the path to the file to properly save
    const fsPath = GetFSPath(params.textDocument.uri);

    // get sematic tokens
    const tokens = await IDL_INDEX.getSemanticTokens(
      info.fsPath,
      info.code,
      new CancellationToken()
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
