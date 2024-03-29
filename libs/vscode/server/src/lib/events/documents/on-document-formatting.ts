import { TaskAssembler } from '@idl/assembler';
import { FormatterType, IAssemblerInputOptions } from '@idl/assembling/config';
import { IDL_LSP_LOG } from '@idl/logger';
import { LoadTask } from '@idl/schemas/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { ParsedTask } from '@idl/types/tasks';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';
import { DocumentFormattingParams } from 'vscode-languageserver/node';

import { GetFormattingConfigForFile } from '../../helpers/get-formatting-config-for-file';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { UpdateDocument } from '../../helpers/update-document';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle formatting files
 *
 * @param event The event from VSCode
 */
export const ON_DOCUMENT_FORMATTING = async (
  event: DocumentFormattingParams,
  formatting?: Partial<IAssemblerInputOptions<FormatterType>>
) => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Document format request', event],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    /**
     * Get formatting config
     */
    const config = GetFormattingConfigForFile(info.fsPath, formatting);

    /**
     * Formatted code
     */
    let formatted: string;

    /**
     * Apply correct formatter
     */
    switch (true) {
      /**
       * Handle task files and manually handle errors from loading tasks
       */
      case IDL_INDEX.isTaskFile(info.fsPath): {
        let task: ParsedTask;
        try {
          task = await LoadTask(info.fsPath, info.code);
        } catch (err) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
            log: IDL_LSP_LOG,
            type: 'error',
            content: ['Error parsing/loading task info.fsPath', err],
            alert: IDL_TRANSLATION.tasks.parsing.errors.invalidTaskFile,
          });
          return;
        }
        formatted = TaskAssembler(task, config);
        break;
      }
      /**
       * Handle PRO code
       */
      case IDL_INDEX.isPROCode(info.fsPath) ||
        IDL_INDEX.isIDLNotebookFile(info.fsPath): {
        formatted = await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
          IDL_INDEX.getWorkerID(info.fsPath),
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.ASSEMBLE_PRO_CODE,
          { file: info.fsPath, code: info.code, formatting: config }
        ).response;
        break;
      }
      default:
        return undefined;
    }

    // check if we couldnt format
    if (formatted === undefined) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'warn',
        content: [
          IDL_TRANSLATION.lsp.events.onDocumentFormattingProblemCode,
          info.fsPath,
        ],
        alert: IDL_TRANSLATION.lsp.events.onDocumentFormattingProblemCode,
        alertMeta: {
          file: info.fsPath,
        },
      });
      return;
    }

    // update doc
    await UpdateDocument(info.uri, formatted, info.doc);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to format request', err],
      alert: IDL_TRANSLATION.lsp.events.onDocumentFormatting,
    });
  }

  /**
   * Actual response should be TextEdit[] which is f-ing stupid. Extremely complicated
   * and makes no sense to work with.
   *
   * Just write to disk and avoid excessive complexity.
   */
  return null;
};
