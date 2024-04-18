import { IDL_LSP_LOG } from '@idl/logger';
import { IDLFileHelper } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { Hover, TextDocumentPositionParams } from 'vscode-languageserver/node';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Wrapper to handle hover help requests
 */
export async function GetHoverHelpWrapper(
  params: TextDocumentPositionParams
): Promise<Hover> {
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

  // get hover help and return
  const hover = await IDL_INDEX.getHoverHelp(
    info.fsPath,
    info.code,
    params.position,
    IDL_CLIENT_CONFIG
  );

  // remove from our main thread lookup
  IDL_INDEX.tokensByFile.remove(info.fsPath);

  return hover;
}

/**
 * Event handler for hover help requests
 */
export const ON_HOVER = async (
  params: TextDocumentPositionParams
): Promise<Hover> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Hover help request', params],
    });

    return await GetHoverHelpWrapper(params);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onHover request', err],
      alert: IDL_TRANSLATION.lsp.events.onHover,
    });
    return undefined;
  }
};
