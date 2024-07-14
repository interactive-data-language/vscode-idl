import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDLNotebookFromRendererMessage,
  IDLNotebookFromRendererMessageType,
} from '@idl/types/notebooks';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { SaveNotebookImage } from './save-notebook-image';

/**
 * Handle messages from our renderer
 */
export async function HandleRendererMessage(
  notebook: vscode.NotebookDocument,
  message: IDLNotebookFromRendererMessage<IDLNotebookFromRendererMessageType>
) {
  IDL_LOGGER.log({
    log: IDL_NOTEBOOK_LOG,
    type: 'debug',
    content: [`Received message type "${message.type}" from notebook renderer`],
  });

  try {
    /**
     * Handle messages
     */
    switch (message.type) {
      /**
       * Save PNG
       */
      case 'save-image':
        await SaveNotebookImage(message.payload);
        break;

      default:
        // do nothing
        break;
    }
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
