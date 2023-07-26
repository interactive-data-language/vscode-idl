import { IDL_LSP_LOG } from '@idl/logger';
import { IFolderRecursion } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { InitializedParams } from 'vscode-languageserver/node';

import { CAPABILITIES } from '../../capabilities.interface';
import { SendProblems } from '../../helpers/send-problems';
import { TrackWorkspaceConfigs } from '../../helpers/track-workspace-config';
import {
  GLOBAL_SERVER_SETTINGS,
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_CONNECTION,
  SERVER_EVENT_MANAGER,
} from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { PROMISE_TIMEOUT, SERVER_INITIALIZED } from '../is-initialized';
import { ON_DID_CHANGE_WORKSPACE_FOLDERS } from './on-did-change-workspace-folders';

/**
 * Flag if we have been resolved
 */
let IS_RESOLVED = false;

/**
 * Promise resolver
 */
let RESOLVER: (folders: IFolderRecursion) => void;

/**
 * Global promise that makes sure our critical information from workspaces
 * has been received.
 *
 * Automatically resolves after 5 seconds in case we don't get this message
 */
export const WORKSPACE_INITIALIZATION = new Promise<IFolderRecursion>((res) => {
  RESOLVER = res;
});

/**
 * Callback to handle initialized our initialized connection
 *
 * @param event The event from VSCode
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ON_INITIALIZED = async (event: InitializedParams) => {
  try {
    // embed timeout here because, for some reason, this gets "in init" callback get called multiple times (i.e. not really on init?)
    if (!IS_RESOLVED) {
      setTimeout(() => {
        if (!IS_RESOLVED) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
            log: IDL_LSP_LOG,
            type: 'warn',
            content: ['Unexpectedly reached ON_INITIALIZED timeout'],
          });
          IS_RESOLVED = true;
          RESOLVER({});
        }
      }, PROMISE_TIMEOUT);
    }

    // listen for workspace folder event changes if we have as a capability
    if (CAPABILITIES.workspaceFolder) {
      try {
        // get the list of current workspaces
        const folders = await SERVER_CONNECTION.workspace.getWorkspaceFolders();

        // return if we have no folders
        // this likely happens when extension is initialized but no workspace
        // folders are open
        if (folders === null) {
          return;
        }

        // get and track folder config
        const info = await TrackWorkspaceConfigs(folders);

        // update that we are resolved
        if (!IS_RESOLVED) {
          IS_RESOLVED = true;
          RESOLVER(info.folders.added);
          return;
        }

        await SERVER_INITIALIZED;

        // alert users
        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_LSP_LOG,
          type: 'info',
          content: ['Indexing workspace folders', folders],
        });

        // alert that we have started indexing
        SERVER_EVENT_MANAGER.sendNotification(
          LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
          { type: 'start' }
        );

        /**
         * Wrap in try/catch so we properly close/cleanup our parsing messages
         * on failures
         */
        try {
          // index workspace folders mapped to locations on disk
          const addedFiles = await IDL_INDEX.indexWorkspace(
            info.folders.added,
            GLOBAL_SERVER_SETTINGS.fullParse
          );

          // remove workspaces that we dont need
          const removedFiles = await IDL_INDEX.removeWorkspace(
            info.folders.removed
          );

          // send problems
          SendProblems(Array.from(new Set(addedFiles.concat(removedFiles))));

          // alert that we have started indexing
          SERVER_EVENT_MANAGER.sendNotification(
            LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
            { type: 'finish' }
          );
        } catch (err) {
          // alert that we have started indexing
          SERVER_EVENT_MANAGER.sendNotification(
            LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
            { type: 'finish' }
          );
          throw err;
        }
      } catch (err) {
        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_LSP_LOG,
          type: 'error',
          content: [IDL_TRANSLATION.lsp.index.failedIndexWorkspace, err],
          alert: IDL_TRANSLATION.lsp.index.failedIndexWorkspace,
        });
      }

      /**
       * Listen for workspace folders changing
       *
       * MUST BE WITHIN HERE - Something related to events and order, not 100%
       * sure.
       */
      SERVER_CONNECTION.workspace.onDidChangeWorkspaceFolders(
        ON_DID_CHANGE_WORKSPACE_FOLDERS
      );
    }
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error handling workspaces on connection initialization', err],
    });
  }
};
