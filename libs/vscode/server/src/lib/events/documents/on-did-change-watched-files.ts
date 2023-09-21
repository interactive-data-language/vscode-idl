import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import {
  DidChangeWatchedFilesParams,
  FileChangeType,
} from 'vscode-languageserver/node';

import { CacheValidFSPath } from '../../helpers/cache-valid';
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
export const ON_DID_CHANGE_WATCHED_FILES = async (
  changes: DidChangeWatchedFilesParams
) => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Watched files changed', changes],
    });

    // track new files
    const added: string[] = [];

    // track updated files
    const updated: string[] = [];

    // files to remove from our index
    const deleted: string[] = [];

    // process each change
    for (let i = 0; i < changes.changes.length; i++) {
      const change = changes.changes[i];
      const fsPath = GetFSPath(change.uri);

      switch (change.type) {
        case FileChangeType.Created:
          added.push(fsPath);
          break;
        case FileChangeType.Deleted:
          deleted.push(fsPath);
          break;
        // TODO: overlaps with document.onDidChangeContent but this is needed
        // because of file changes that we dont have open. we are super fast for
        // indexing files, so it should not be a huge issue
        case FileChangeType.Changed:
          // skip if our cache is valid
          if (CacheValidFSPath(fsPath)) {
            continue;
          }
          updated.push(fsPath);
          break;
        default:
          // do nothing
          break;
      }
    }

    // remove all files
    if (deleted.length > 0) {
      await IDL_INDEX.removeWorkspaceFiles(deleted, true);
    }

    // add/update new symbols
    if (added.length > 0 || updated.length > 0) {
      /**
       * Index all of our files
       *
       * Separates into appropriate buckets internally
       */
      await IDL_INDEX.indexFiles(
        Array.from(new Set(added.concat(updated))),
        GetFileStringsFromFSPath,
        new CancellationToken()
      );
    }

    // send problems for all files
    SendProblems(Array.from(new Set(deleted.concat(added).concat(updated))));
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to change in watched files', err],
    });
  }
};
