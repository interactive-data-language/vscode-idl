import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { Hover, TextDocumentPositionParams } from 'vscode-languageserver/node';

import { IDL_INDEX } from '../../file-management/initialize-file-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';

/**
 * Wrapper to handle hover help requests
 */
export async function GetHoverHelpWrapper(
  params: TextDocumentPositionParams
): Promise<Hover> {
  // get the path to the file to properly save
  const fsPath = GetFSPath(params.textDocument.uri);

  // do nothing
  if (!IDL_INDEX.isPROCode(fsPath)) {
    return undefined;
  }

  // listen for hover help
  return await IDL_INDEX.getHoverHelp(
    fsPath,
    await GetFileStrings(params.textDocument.uri),
    params.position,
    IDL_CLIENT_CONFIG
  );
}

/**
 * Event handler for hover help requests
 */
export const ON_HOVER = async (
  params: TextDocumentPositionParams
): Promise<Hover> => {
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
