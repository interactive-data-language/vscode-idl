import {
  DEFAULT_ASSEMBLER_OPTIONS,
  type FormatterType,
  type IAssemblerOptions,
} from '@idl/assembling/config';
import { GenerateIDLJSON } from '@idl/generators/idlformat';
import { GenerateIDLPackage } from '@idl/generators/idlpackage';
import { GenerateIDLTest } from '@idl/generators/idltest';
import { IDL_LSP_LOG } from '@idl/logger';
import {
  IDL_FORMAT_URI,
  IDL_PACKAGE_URI,
  IDL_TEST_URI,
} from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import type {
  InitWorkspaceConfigMessage,
  LanguageServerPayload,
} from '@idl/vscode/events/messages';
import { existsSync } from 'fs';
import { join } from 'path';

import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-language-server';
import { SERVER_INITIALIZED } from '../../is-initialized';

/**
 * Handle requests to initialize an "idlformat.json", "idlpackage.json", or
 * "idltest.json" file
 *
 * @param event The event sent from VSCode
 */
export const ON_INIT_WORKSPACE_CONFIG = async (
  payload: LanguageServerPayload<InitWorkspaceConfigMessage>,
) => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Init config for workspace', payload.folder],
    });

    /** Name of the file we are creating */
    let fileName: string;

    /** Creates the file and returns its path */
    let create: () => string;

    switch (payload.type) {
      case 'package':
        fileName = IDL_PACKAGE_URI;
        create = () => GenerateIDLPackage(payload.folder);
        break;
      case 'test':
        fileName = IDL_TEST_URI;
        create = () => GenerateIDLTest(payload.folder);
        break;
      // default to formatting for messages from older clients
      default:
        fileName = IDL_FORMAT_URI;
        create = () =>
          GenerateIDLJSON(payload.folder, {
            ...DEFAULT_ASSEMBLER_OPTIONS,
            ...IDL_CLIENT_CONFIG.code.formatting,
            style: IDL_CLIENT_CONFIG.code.formattingStyle,
          } as IAssemblerOptions<FormatterType>);
        break;
    }

    // never overwrite an existing file
    if (existsSync(join(payload.folder, fileName))) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: ['Config file already exists', fileName, payload.folder],
        alert:
          IDL_TRANSLATION.commands.notifications.initConfig.allWorkspacesHaveConfig.replace(
            '{0}',
            fileName,
          ),
      });
      return;
    }

    const file = create();

    // alert client
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Created config file', file],
      alert:
        IDL_TRANSLATION.commands.notifications.initConfig.configFileCreated.replace(
          '{0}',
          fileName,
        ),
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
