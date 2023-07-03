import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { CodeAction, CodeActionParams } from 'vscode-languageserver/node';

import { IDL_INDEX } from '../../file-management/initialize-file-manager';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';

/**
 * Event handler for retrieving code actions
 */
export const ON_CODE_ACTIONS = async (
  params: CodeActionParams
): Promise<CodeAction[]> => {
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['CodeAction request', params],
    });

    // get the path to the file to properly save
    const fsPath = GetFSPath(params.textDocument.uri);

    // do nothing
    if (!IDL_INDEX.isPROCode(fsPath)) {
      return undefined;
    }

    // get the path to the file to properly save
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to code action request', err],
      alert: IDL_TRANSLATION.lsp.events.onSemanticHighlighting,
    });
    return undefined;
  }
};
