import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  PrepareNotebookCellPayload,
  PrepareNotebookCellResponse,
} from '@idl/vscode/events/messages';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle preparing a notebook cell for execution
 *
 * @param event The event from VSCode
 */
export const ON_PREPARE_NOTEBOOK_CELL = async (
  event: PrepareNotebookCellPayload
): Promise<PrepareNotebookCellResponse> => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Preparing notebook cell', event],
    });

    /**
     * Get information for our cell (gets path for language server lookup)
     */
    const info = await ResolveFSPathAndCodeForURI(event.cellUri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    return {
      text: 'I work!',
      offset: 0,
    };
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error preparing notebook cell', err],
      alert: IDL_TRANSLATION.lsp.events.onPrepareNotebookCell,
    });
    return undefined;
  }
};
