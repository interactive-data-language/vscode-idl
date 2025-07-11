import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDLFileHelper, Sleep } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  GenerateTaskMessage,
  LanguageServerPayload,
} from '@idl/vscode/events/messages';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';

import { GetFormattingConfigForFile } from '../../helpers/get-formatting-config-for-file';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { UpdateDocument } from '../../helpers/update-document';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-language-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Do we write to disk or not?
 */
const WRITE_TASK = true;

/**
 * Handle requests to generate a task file
 *
 * @param event The event sent from VSCode
 */
export const ON_GENERATE_TASK = async (
  payload: LanguageServerPayload<GenerateTaskMessage>
) => {
  await SERVER_INITIALIZED;
  try {
    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(payload.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    // do nothing
    if (!IDLFileHelper.isPROCode(info.fsPath)) {
      return undefined;
    }

    /** Formatting config for info.fsPath */
    const config = GetFormattingConfigForFile(info.fsPath);

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Init/update task for file: "${info.fsPath}"`,
    });

    /**
     * Formatted code
     */
    const response = await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
      IDL_INDEX.getWorkerID(info.fsPath),
      LSP_WORKER_THREAD_MESSAGE_LOOKUP.GENERATE_TASK,
      {
        ...payload,
        fsPath: info.fsPath,
        code: info.code,
        config,
      }
    ).response;

    // check for error
    if (!response.result.success) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'error',
        content: [
          'Error while initializing/updating task file',
          (response.result as GenerateTaskResult<false>).failureReason,
        ],
        alert: (response.result as GenerateTaskResult<false>).failureReason,
      });
      return;
    }

    /**
     * Don't index our task file.
     *
     * This happens automatically because we open it
     *
     * There is some weird behavior where we dont see the right hover help
     * for task properties unless we open the file (on changed watched files bug?)
     *
     * So we just open to work around it
     */
    // // index task file
    // await IDL_INDEX.indexFile(
    //   (result as GenerateTaskResult<true>).taskFile,
    //   (result as GenerateTaskResult<true>).formattedTask
    // );

    // alert client
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Initialized/updated task for file: "${info.fsPath}"`,
      alert: IDL_TRANSLATION.commands.notifications.initTask.created,
      alertMeta: {
        openFile: (response.result as GenerateTaskResult<true>).taskFile,
      },
    });

    // slight pause, to allow server to parse task file
    await Sleep(200);

    // update main level program if needed
    if (response.proCode) {
      await UpdateDocument(payload.uri, response.proCode);
    }
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error while initializing/updating task file', err],
      alert: IDL_TRANSLATION.lsp.events.onGenerateTask,
    });
  }
};
