import { FindFiles } from '@idl/idl/files';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { WorkspaceFoldersChangeEvent } from 'vscode-languageserver/node';

import { MergeFolderRecursion } from '../../helpers/merge-folder-recursion';
import { SendProblems } from '../../helpers/send-problems';
import {
  RemoveWorkspaceConfigs,
  TrackWorkspaceConfigs,
} from '../../helpers/track-workspace-config';
import {
  GLOBAL_SERVER_SETTINGS,
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from '../../initialize-language-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle workspace folders being changed
 *
 * @param event The event from VSCode
 */
export const ON_DID_CHANGE_WORKSPACE_FOLDERS = async (
  ev: WorkspaceFoldersChangeEvent
) => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Workspace folder change', ev],
    });

    // clean up preferences for removed folders
    const infoRemoved = RemoveWorkspaceConfigs(ev.removed);

    // get and track folder config
    const infoAdded = await TrackWorkspaceConfigs(ev.added);

    // alert that we have started indexing
    SERVER_MESSENGER.sendNotification(LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING, {
      type: 'start',
    });

    /** Find files we added */
    const filesAdded = await FindFiles(
      MergeFolderRecursion(infoRemoved.folders.added, infoAdded.folders.added)
    );

    // add workspaces
    await IDL_INDEX.indexWorkspaceFiles(
      filesAdded,
      MergeFolderRecursion(infoRemoved.folders.added, infoAdded.folders.added),
      GLOBAL_SERVER_SETTINGS.fullParse
    );

    /** Find files we removed */
    const filesRemoved = await FindFiles(
      MergeFolderRecursion(
        infoRemoved.folders.removed,
        infoAdded.folders.removed
      )
    );

    // remove workspaces that we dont need
    await IDL_INDEX.removeWorkspaceFiles(filesRemoved);

    // send problems
    SendProblems(Array.from(new Set(filesRemoved.concat(filesAdded))));

    // alert that we have started indexing
    SERVER_MESSENGER.sendNotification(LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING, {
      type: 'finish',
    });
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to workspace folder change', err],
      alert: IDL_TRANSLATION.lsp.events.onDidChangeWorkspaceFolders,
    });
  }
};
