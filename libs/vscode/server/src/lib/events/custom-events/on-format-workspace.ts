import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_NOTEBOOK_EXTENSION } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  FormatWorkspacePayload,
  FormatWorkspaceResponse,
  LANGUAGE_SERVER_MESSAGE_LOOKUP,
} from '@idl/vscode/events/messages';
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

  try {
    /**
     * Find files and exclude notebooks
     */
    const files = (await IDL_INDEX.findFiles(event.folders)).filter(
      (file) => !file.toLowerCase().endsWith(IDL_NOTEBOOK_EXTENSION)
    );

    /** Track file failures */
    const failures: string[] = [];

    // return if no files to process
    if (files.length === 0) {
      return { failures };
    }

    // init progress
    const id = nanoid();

    // send message to start progress
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.PROGRESS,
      {
        progressId: id,
        percent: 0,
        title: IDL_TRANSLATION.lsp.progress.formatWorkspace,
      }
    );

    /**
     * Format each file
     */
    for (let i = 0; i < files.length; i++) {
      try {
        /**
         * Resolve the fspath to our cell and retrieve code
         */
        const info = await ResolveFSPathAndCodeForURI(
          URI.file(files[i]).toString()
        );

        // return if nothing found
        if (info === undefined) {
          return undefined;
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
          continue;
        }

        // update the doc in VSCode
        await UpdateDocument(info.uri, formatted, info.doc);
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
          percent: 100 * Math.floor((i + 1) / files.length),
          title: IDL_TRANSLATION.lsp.progress.formatWorkspace,
        }
      );
    }

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
  }
};
