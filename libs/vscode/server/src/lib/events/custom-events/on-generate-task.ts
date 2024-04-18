import { CancellationToken } from '@idl/cancellation-tokens';
import {
  GenerateENVITask,
  GenerateENVITaskMainLevelProgram,
} from '@idl/generators/envi-task';
import {
  GenerateIDLTask,
  GenerateIDLTaskMainLevelProgram,
} from '@idl/generators/idl-task';
import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { IDL_LSP_LOG } from '@idl/logger';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDLFileHelper, GetFSPath, Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  GenerateTaskMessage,
  LanguageServerPayload,
} from '@idl/vscode/events/messages';

import { GetFileStrings } from '../../helpers/get-file-strings';
import { GetFormattingConfigForFile } from '../../helpers/get-formatting-config-for-file';
import { UpdateDocument } from '../../helpers/update-document';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
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
     * File we want to make a task for
     */
    const fsPath = GetFSPath(payload.uri);

    // return if not PRO code
    if (!IDLFileHelper.isPROCode(fsPath)) {
      return;
    }

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Init/update task for file: "${fsPath}"`,
    });

    /** Formatting config for file */
    const config = GetFormattingConfigForFile(fsPath);

    /** Content of our PRO file */
    const proCode = await GetFileStrings(payload.uri);

    // re-index the file
    const parsed = await IDL_INDEX.getParsedProCode(
      fsPath,
      proCode,
      new CancellationToken(),
      {
        postProcess: true,
      }
    );

    /**
     * Make our task
     */
    const result =
      payload.type === 'envi'
        ? await GenerateENVITask(fsPath, parsed, config, WRITE_TASK)
        : await GenerateIDLTask(fsPath, parsed, config, WRITE_TASK);

    // check for error
    if (!result.success) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'error',
        content: [
          'Error while initializing/updating task file',
          (result as GenerateTaskResult<false>).failureReason,
        ],
        alert: (result as GenerateTaskResult<false>).failureReason,
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
      content: `Initialized/updated task for file: "${fsPath}"`,
      alert: IDL_TRANSLATION.commands.notifications.initTask.created,
      alertMeta: {
        openFile: (result as GenerateTaskResult<true>).taskFile,
      },
    });

    // slight pause, to allow server to parse task file
    await Sleep(200);

    // check of we have a main level program
    if (parsed.tree[parsed.tree.length - 1].name !== TOKEN_NAMES.MAIN_LEVEL) {
      const mainAdd =
        payload.type === 'envi'
          ? GenerateENVITaskMainLevelProgram(result as GenerateTaskResult<true>)
          : GenerateIDLTaskMainLevelProgram(result as GenerateTaskResult<true>);

      // make new text
      const newContent = proCode + '\n' + mainAdd;

      // send content
      await UpdateDocument(payload.uri, newContent);
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
