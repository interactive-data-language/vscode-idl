import { FormatterType, IAssemblerInputOptions } from '@idl/assembling/config';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { DocumentFormattingParams } from 'vscode-languageserver/node';

import { FormatFile } from '../../helpers/format-file';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { UpdateDocument } from '../../helpers/update-document';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
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

  // log information
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_LOG,
    type: 'debug',
    content: ['Document format request', event],
  });

  try {
    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    /**
     * Format our file
     */
    const formatted = await FormatFile(event, formatting);

    // check if we could not format
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
      return null;
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
