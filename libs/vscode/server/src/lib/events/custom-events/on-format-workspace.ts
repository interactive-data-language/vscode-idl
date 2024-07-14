import { IDL_LSP_LOG } from '@idl/logger';
import { PRO_CODE_GLOB_PATTERN } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  FormatWorkspacePayload,
  FormatWorkspaceResponse,
  LANGUAGE_SERVER_MESSAGE_LOOKUP,
} from '@idl/vscode/events/messages';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { URI } from 'vscode-uri';

import { FormatFile } from '../../helpers/format-file';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { UpdateDocument } from '../../helpers/update-document';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_EVENT_MANAGER,
} from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle formatting code in workspaces
 *
 * @param event The event from VSCode
 */
export const ON_FORMAT_WORKSPACE = async (
  event: FormatWorkspacePayload
): Promise<FormatWorkspaceResponse> => {
  await SERVER_INITIALIZED;

  /** ID for progress bar */
  const id = nanoid();

  try {
    /**
     * Find files and exclude notebooks
     */
    const files = await IDL_INDEX.findFiles(
      event.folders,
      PRO_CODE_GLOB_PATTERN
    );

    /** Track file failures */
    const failures: string[] = [];

    // return if no files to process
    if (files.length === 0) {
      return { failures };
    }

    // send message to start progress
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.PROGRESS,
      {
        progressId: id,
        increment: 0,
        title: IDL_TRANSLATION.lsp.progress.formatWorkspace,
      }
    );

    /**
     * Track all work
     */
    const promises: Promise<any>[] = [];

    /**
     * Format each file
     */
    for (let i = 0; i < files.length; i++) {
      promises.push(
        // eslint-disable-next-line no-async-promise-executor
        new Promise<void>(async (res) => {
          try {
            /**
             * Resolve the fspath to our cell and retrieve code
             */
            const info = await ResolveFSPathAndCodeForURI(
              URI.file(files[i]).toString()
            );

            // return if nothing found
            if (info === undefined) {
              res();
              return;
            }

            /**
             * Attempt to format
             */
            const formatted = await FormatFile({
              // options are ignored
              options: {
                tabSize: 2,
                insertSpaces: true,
              },
              textDocument: {
                uri: info.uri,
              },
            });

            /**
             * Check if we failed to format
             */
            if (formatted === undefined) {
              failures.push(files[i]);
              res();
              return;
            }

            // update the doc in VSCode
            if (info.doc !== undefined) {
              await UpdateDocument(info.uri, formatted, info.doc);
            } else {
              await writeFile(info.fsPath, formatted, 'utf-8');
            }
          } catch (err) {
            IDL_LANGUAGE_SERVER_LOGGER.log({
              log: IDL_LSP_LOG,
              type: 'error',
              content: [
                `Error trying to format file in workspace: "${files[i]}"`,
                err,
              ],
            });
            failures.push(files[i]);
          }

          // update progress
          SERVER_EVENT_MANAGER.sendNotification(
            LANGUAGE_SERVER_MESSAGE_LOOKUP.PROGRESS,
            {
              progressId: id,
              increment: 100 * (1 / files.length),
              title: IDL_TRANSLATION.lsp.progress.formatWorkspace,
            }
          );

          // finish promise
          res();
        })
      );
    }

    // wait for promises to finish
    await Promise.all(promises);

    // update progress
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.PROGRESS,
      {
        progressId: id,
        increment: 1 / files.length,
        title: IDL_TRANSLATION.lsp.progress.formatWorkspace,
        finished: true,
      }
    );

    return {
      failures,
    };
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: [`Error trying to format code in workspace`, err],
      alert: IDL_TRANSLATION.lsp.events.onWorkspaceFormatting,
    });

    // update progress
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.PROGRESS,
      {
        progressId: id,
        increment: 1,
        title: IDL_TRANSLATION.lsp.progress.formatWorkspace,
        finished: true,
      }
    );
  }
};
