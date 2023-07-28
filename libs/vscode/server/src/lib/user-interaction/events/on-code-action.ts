import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { CodeAction, CodeActionParams } from 'vscode-languageserver/node';

import { SERVER_INITIALIZED } from '../../file-management/is-initialized';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { ResolveFSPathAndCodeForURI } from '../helpers/resolve-fspath-and-code-for-uri';

/**
 * Event handler for retrieving code actions
 */
export const ON_CODE_ACTIONS = async (
  params: CodeActionParams
): Promise<CodeAction[]> => {
  await SERVER_INITIALIZED;
  try {
    // IDL_LANGUAGE_SERVER_LOGGER.log({
    //   log: IDL_LSP_LOG,
    //   type: 'debug',
    //   content: ['CodeAction request', params],
    // });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(params.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
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
