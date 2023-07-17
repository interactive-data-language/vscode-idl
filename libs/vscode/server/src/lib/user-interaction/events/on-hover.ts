import { IDL_LSP_LOG } from '@idl/logger';
import { NotebookToIDLNotebook } from '@idl/notebooks';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { Hover, TextDocumentPositionParams } from 'vscode-languageserver/node';

import { IDL_INDEX } from '../../file-management/initialize-document-manager';
import { NOTEBOOK_MANAGER } from '../../file-management/notebooks/initialize-notebook-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';

/**
 * Wrapper to handle hover help requests
 */
export async function GetHoverHelpWrapper(
  params: TextDocumentPositionParams
): Promise<Hover> {
  /**
   * Split on hashtag in case we have a notebook coming through
   */
  const split = params.textDocument.uri.split('#');

  // get the path to the file to properly save
  const fsPath = GetFSPath(split[0]);

  // check if we have a notebook (cell index after hashtag)
  if (split.length === 2) {
    // do nothing
    if (!IDL_INDEX.isIDLNotebookFile(fsPath)) {
      console.log('Not a notebook');
      return undefined;
    }

    /**
     * get notebook document
     */
    const nb = NOTEBOOK_MANAGER.getNotebookDocument(split[0]);

    // return if no matching notebook
    if (nb === undefined) {
      console.log('No notebook');
      return undefined;
    }

    /**
     * Convert to IDL and get text
     */
    const idlNotebook = NotebookToIDLNotebook(nb, NOTEBOOK_MANAGER);

    // listen for hover help
    return await IDL_INDEX.getHoverHelp(
      `${fsPath}#${split[1]}`,
      idlNotebook.cells[+split[1]].text,
      params.position,
      IDL_CLIENT_CONFIG
    );
  } else {
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
