import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  DebugConsoleCompletionPayload,
  DebugConsoleCompletionResponse,
} from '@idl/vscode/events/messages';

import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-language-server';
import { SERVER_INITIALIZED } from '../../is-initialized';
import { IDL_INDEX } from '../initialize-document-manager';

/**
 * Event handler for debug console completion requests
 */
export const ON_DEBUG_CONSOLE_COMPLETION = async (
  params: DebugConsoleCompletionPayload,
): Promise<DebugConsoleCompletionResponse> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['AutoComplete request (debug console)', params],
    });

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

    return await IDL_INDEX.getAutoComplete(
      'foo-file.pro',
      params.code,
      params.position,
      IDL_CLIENT_CONFIG,
      clientConfig,
    );
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: [
        'Error responding to onCompletion request (debug console)',
        err,
      ],
      alert: IDL_TRANSLATION.lsp.events.onCompletion,
    });
    return [];
  }
};
