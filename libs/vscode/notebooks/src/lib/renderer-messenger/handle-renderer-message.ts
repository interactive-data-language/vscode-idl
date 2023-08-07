import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import {
  IDLNotebookRendererMessage,
  IDLNotebookRendererMessageType,
} from '@idl/notebooks/types';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';

/**
 * Handle messages from our renderer
 */
export async function HandleRendererMessage(
  message: IDLNotebookRendererMessage<IDLNotebookRendererMessageType>
) {
  try {
    IDL_LOGGER.log({
      log: IDL_NOTEBOOK_LOG,
      type: 'info',
      content: [`received message type "${message.type}" from renderer`],
    });
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_NOTEBOOK_LOG,
      type: 'error',
      content: [
        IDL_TRANSLATION.notebooks.errors.handlingMessageFromRenderer,
        err,
      ],
      alert: IDL_TRANSLATION.notebooks.errors.handlingMessageFromRenderer,
    });
  }
}
