import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  PrepareNotebookCellPayload,
  PrepareNotebookCellResponse,
} from '@idl/vscode/events/messages';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
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
      type: 'debug',
      content: ['Preparing notebook cell', event],
    });

    /**
     * Get information for our cell (gets path for language server lookup)
     */
    const info = await ResolveFSPathAndCodeForURI(event.cellUri);

    /**
     * Check if no info, means that our NB is not saved to disk
     * so we need to work around it
     */
    if (info === undefined) {
      return await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
        IDL_INDEX.getNextWorkerID(),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.PREPARE_NOTEBOOK_CELL,
        event
      ).response;
    } else {
      return await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
        IDL_INDEX.getWorkerID(info.fsPath),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.PREPARE_NOTEBOOK_CELL,
        {
          ...event,
          // update cell URI to use LSP URI
          cellUri: info.fsPath,
        }
      ).response;
    }
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
