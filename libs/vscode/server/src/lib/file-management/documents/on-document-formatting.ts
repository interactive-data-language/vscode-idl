import { Assembler, TaskAssembler } from '@idl/assembler';
import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { ParsedTask } from '@idl/data-types/tasks';
import { IDL_LSP_LOG } from '@idl/logger';
import { LoadTask } from '@idl/schemas/tasks';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { DocumentFormattingParams } from 'vscode-languageserver/node';

import { GetFileStrings } from '../../helpers/get-file-strings';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
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
  event: DocumentFormattingParams
) => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Document format request', event],
    });

    /** Path to file on disk */
    const file = GetFSPath(event.textDocument.uri);

    /**
     * Make default formatting config for file
     *
     * Use settings from VSCode client as our default
     */
    const clientConfig: IAssemblerOptions<FormatterType> = {
      ...DEFAULT_ASSEMBLER_OPTIONS,
      ...IDL_CLIENT_CONFIG.code.formatting,
      style: IDL_CLIENT_CONFIG.code.formattingStyle,
    };

    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Client config', clientConfig],
    });

    /** Formatting config for file */
    const config = IDL_INDEX.getConfigForFile(file, clientConfig);

    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Formatting config', config],
    });

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
      case IDL_INDEX.isTaskFile(file): {
        let task: ParsedTask;
        try {
          task = await LoadTask(
            file,
            await GetFileStrings(event.textDocument.uri)
          );
        } catch (err) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
            log: IDL_LSP_LOG,
            type: 'error',
            content: ['Error parsing/loading task file', err],
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
      case IDL_INDEX.isPROCode(file): {
        // re-index the file
        const tokens = await IDL_INDEX.getParsedProCode(
          file,
          await GetFileStrings(event.textDocument.uri),
          { postProcess: true }
        );

        // format
        formatted = Assembler(tokens, config);
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
        content: IDL_TRANSLATION.lsp.events.onDocumentFormattingProblemCode,
        alert: IDL_TRANSLATION.lsp.events.onDocumentFormattingProblemCode,
        alertMeta: {
          file,
        },
      });
      return;
    }

    // update file
    UpdateDocument(event.textDocument.uri, formatted);
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
