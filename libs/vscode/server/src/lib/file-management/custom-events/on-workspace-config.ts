import { IDL_LSP_LOG } from '@idl/logger';
import { IFolderRecursion } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  LANGUAGE_SERVER_MESSAGE_LOOKUP,
  LanguageServerPayload,
  WorkspaceConfigMessage,
} from '@idl/vscode/events/messages';

import { SendProblems } from '../../helpers/send-problems';
import { UpdateClientFolderConfig } from '../../helpers/track-workspace-config';
import {
  GLOBAL_SERVER_SETTINGS,
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_EVENT_MANAGER,
} from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { PROMISE_TIMEOUT } from '../is-initialized';

/**
 * Flag if we have been resolved
 */
let IS_RESOLVED = false;

/**
 * Promise resolver
 */
let RESOLVER: (folders: IFolderRecursion) => void;

/**
 * Global promise that makes sure our critical information about our configuration
 *
 * Automatically resolves after 5 seconds in case we don't get this message
 */
export const CONFIG_INITIALIZATION = new Promise<IFolderRecursion>((res) => {
  RESOLVER = res;
});

/**
 * Handle workspace config changes - custom event
 *
 * @param event The event sent from VSCode
 */
export const ON_WORKSPACE_CONFIG = async (
  payload: LanguageServerPayload<WorkspaceConfigMessage>
) => {
  setTimeout(() => {
    if (!IS_RESOLVED) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'warn',
        content: ['Unexpectedly reached ON_WORKSPACE_CONFIG timeout'],
      });
      IS_RESOLVED = true;
      RESOLVER({});
    }
  }, PROMISE_TIMEOUT);

  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Workspace config updated or received', payload.config],
    });

    // update debug logs
    IDL_LANGUAGE_SERVER_LOGGER.setDebug(payload.config.debugMode);

    // check for differences in folders
    const info = await UpdateClientFolderConfig(payload.config);

    // check if we are resolved or not yet
    if (!IS_RESOLVED) {
      IS_RESOLVED = true;
      RESOLVER(info.folders.added);
      return;
    }

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
      // add folders
      await IDL_INDEX.indexWorkspace(
        info.folders.added,
        GLOBAL_SERVER_SETTINGS.fullParse
      );

      // remove folders
      await IDL_INDEX.removeWorkspace(info.folders.removed);

      // send problems with settings changes
      SendProblems(Object.keys(IDL_INDEX.getSyntaxProblems()));

      // alert that we are done
      SERVER_EVENT_MANAGER.sendNotification(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
        { type: 'finish' }
      );
    } catch (err) {
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
      content: [
        'Error while updating workspace config and sending problems',
        err,
      ],
      alert: IDL_TRANSLATION.lsp.events.onWorkspaceConfig,
    });
  }
};
