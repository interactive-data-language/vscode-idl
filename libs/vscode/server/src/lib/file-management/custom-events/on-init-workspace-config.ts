import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { GenerateIDLJSON } from '@idl/generators/idl.json';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  InitWorkspaceConfigMessage,
  LanguageServerPayload,
} from '@idl/vscode/events/messages';

import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Handle requests to initialize an "idl.json" file
 *
 * @param event The event sent from VSCode
 */
export const ON_INIT_WORKSPACE_CONFIG = async (
  payload: LanguageServerPayload<InitWorkspaceConfigMessage>
) => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Init config for workspace', payload.folder],
    });

    // copy default options
    const copied: IAssemblerOptions<FormatterType> = {
      ...DEFAULT_ASSEMBLER_OPTIONS,
      ...IDL_CLIENT_CONFIG.code.formatting,
      style: IDL_CLIENT_CONFIG.code.formattingStyle,
    };

    const file = GenerateIDLJSON(payload.folder, copied);

    // alert client
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Init config for workspace', payload.folder],
      alert:
        IDL_TRANSLATION.commands.notifications.initConfig.configFileCreated,
      alertMeta: {
        openFile: file,
      },
    });
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error while initializing config for workspace folder', err],
      alert: IDL_TRANSLATION.lsp.events.onInitWorkspaceConfig,
    });
  }
};
