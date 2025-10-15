import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  PrepareIDLCodePayload,
  PrepareNotebookCellResponse,
} from '@idl/vscode/events/messages';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-language-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle preparing IDL code for execution
 *
 * @param event The event from VSCode
 */
export const ON_PREPARE_IDL_CODE = async (
  event: PrepareIDLCodePayload
): Promise<PrepareNotebookCellResponse> => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Preparing idl code', event],
    });

    return await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
      IDL_INDEX.getNextWorkerID(),
      LSP_WORKER_THREAD_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
      event
    ).response;
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error preparing IDL code', err],
      alert: IDL_TRANSLATION.lsp.events.onPrepareIDLCode,
    });
    return undefined;
  }
};
