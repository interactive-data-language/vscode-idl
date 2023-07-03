import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  CompletionItem,
  TextDocumentPositionParams,
} from 'vscode-languageserver/node';

import { IDL_INDEX } from '../../file-management/initialize-file-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';

/**
 * Wrapper to handle auto-completion requests
 */
export async function GetAutoCompleteWrapper(
  params: TextDocumentPositionParams
): Promise<CompletionItem[]> {
  // get the path to the file to properly save
  const fsPath = GetFSPath(params.textDocument.uri);

  // do nothing
  if (!IDL_INDEX.isPROCode(fsPath)) {
    return undefined;
  }

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

  /**
   * Get assembler options
   */
  const idlJson = IDL_INDEX.getConfigForFile(
    GetFSPath(params.textDocument.uri),
    clientConfig
  );

  // listen for hover help
  return await IDL_INDEX.getAutoComplete(
    fsPath,
    await GetFileStrings(params.textDocument.uri),
    params.position,
    IDL_CLIENT_CONFIG,
    idlJson
  );
}

/**
 * Event handler for completion requests
 */
export const ON_COMPLETION = async (
  position: TextDocumentPositionParams
): Promise<CompletionItem[]> => {
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['AutoComplete request', position],
    });

    return await GetAutoCompleteWrapper(position);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onCompletion request', err],
      alert: IDL_TRANSLATION.lsp.events.onCompletion,
    });
    return undefined;
  }
};
