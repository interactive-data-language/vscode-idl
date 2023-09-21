import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IFileRenamePayload } from '@idl/vscode/events/messages';

import { GetFileStringsFromFSPath } from '../../helpers/get-file-strings';
import { SendProblems } from '../../helpers/send-problems';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle file changes in watched workspaces
 *
 * @param event The event from VSCode
 */
export const ON_DID_RENAME = async (message: IFileRenamePayload) => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Renamed files', message],
    });

    // track new files
    const added: string[] = message.files.map((file) => file.newUri);

    // files to remove from our index
    const deleted: string[] = message.files.map((file) => file.oldUri);

    /**
     * Get unique files
     */
    const unique = Array.from(new Set(deleted.concat(added)));

    // remove all files
    await IDL_INDEX.removeWorkspaceFiles(unique, true);

    // add/update new symbols
    if (added.length > 0) {
      /**
       * Index all of our files
       *
       * Separates into appropriate buckets internally
       */
      await IDL_INDEX.indexFiles(
        added,
        GetFileStringsFromFSPath,
        new CancellationToken()
      );
    }

    // send problems
    SendProblems(unique);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding file rename', err],
      alert: IDL_TRANSLATION.lsp.events.onDidRename,
    });
  }
};
