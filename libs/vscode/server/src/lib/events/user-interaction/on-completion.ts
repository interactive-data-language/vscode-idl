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

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Wrapper to handle auto-completion requests
 */
export async function GetAutoCompleteWrapper(
  params: TextDocumentPositionParams
): Promise<CompletionItem[]> {
  /**
   * Resolve the fspath to our cell and retrieve code
   */
  const info = await ResolveFSPathAndCodeForURI(params.textDocument.uri);

  // return if nothing found
  if (info === undefined) {
    return undefined;
  }

  // return if not a file we can process
  if (
    !(
      IDL_INDEX.isPROCode(info.fsPath) ||
      IDL_INDEX.isIDLNotebookFile(info.fsPath)
    )
  ) {
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
  const completion = await IDL_INDEX.getAutoComplete(
    info.fsPath,
    info.code,
    params.position,
    IDL_CLIENT_CONFIG,
    idlJson
  );

  // remove from our main thread lookup
  IDL_INDEX.tokensByFile.remove(info.fsPath);

  // return completion
  return completion;
}

/**
 * Event handler for completion requests
 */
export const ON_COMPLETION = async (
  position: TextDocumentPositionParams
): Promise<CompletionItem[]> => {
  await SERVER_INITIALIZED;
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
