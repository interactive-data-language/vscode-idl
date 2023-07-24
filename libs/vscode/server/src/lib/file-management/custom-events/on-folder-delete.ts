import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IFolderDeletePayload } from '@idl/vscode/events/messages';

import { SendProblems } from '../../helpers/send-problems';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle when folders get deleted in VSCode
 *
 * @param event The event from VSCode
 */
export const ON_FOLDER_DELETE = async (message: IFolderDeletePayload) => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Folder delete', message],
    });

    /** Folders we are deleting */
    const folders = message.folders;

    /**
     * Track files we need to remove
     */
    const toRemove: string[] = [];

    /**
     * Get known files
     */
    const knownFiles = Object.keys(IDL_INDEX.knownFiles);

    // process each known file
    for (let i = 0; i < knownFiles.length; i++) {
      // process each folder that is getting deleted
      for (let j = 0; j < folders.length; j++) {
        // if we match, track and stop checking
        if (knownFiles[i].startsWith(folders[j])) {
          toRemove.push(knownFiles[i]);
          break;
        }
      }
    }

    /**
     * Get files we removed
     */
    await IDL_INDEX.removeWorkspaceFiles(toRemove);

    // send problems
    SendProblems(toRemove);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding folder delete', err],
      alert: IDL_TRANSLATION.lsp.events.onDidRename,
    });
  }
};
