import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { NotebookToProCode } from '@idl/notebooks/idl-index';
import { NotebookToIDLNotebook } from '@idl/notebooks/shared';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  INotebookToProCodePayload,
  INotebookToProCodeResponse,
} from '@idl/vscode/events/messages';

import { GetFormattingConfigForFile } from '../../helpers/get-formatting-config-for-file';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { NOTEBOOK_MANAGER } from '../initialize-notebook-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle converting notebooks to PRO code
 *
 * @param event The event from VSCode
 */
export const ON_NOTEBOOK_TO_PRO_CODE = async (
  event: INotebookToProCodePayload
): Promise<INotebookToProCodeResponse> => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Notebook to PRO code request', event],
    });

    /**
     * Get our notebook document
     */
    const nb = NOTEBOOK_MANAGER.getNotebookDocument(event.uri);

    /**
     * Get text for all cells for quick access
     */
    const idlNotebook = NotebookToIDLNotebook(nb, NOTEBOOK_MANAGER);

    /**
     * Get the path to our notebook on disk
     */
    const fsPath = GetFSPath(event.uri);

    /** Formatting config for info.fsPath */
    const config = GetFormattingConfigForFile(fsPath);

    return {
      code: await NotebookToProCode(
        IDL_INDEX,
        fsPath,
        idlNotebook,
        config,
        new CancellationToken(),
        event.options || {}
      ),
    };
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error converting notebook to PRO code', err],
      alert: IDL_TRANSLATION.lsp.events.onDocumentFormatting,
    });
    return null;
  }
};
