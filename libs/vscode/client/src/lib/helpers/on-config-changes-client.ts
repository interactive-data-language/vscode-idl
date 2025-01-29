import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';

import {
  LANGUAGE_SERVER_FAILED_START,
  LANGUAGE_SERVER_MESSENGER,
} from '../start-language-server';

/**
 * Callback to manage when configuration changes
 */
export const ON_CONFIG_CHANGES_CLIENT = () => {
  IDL_LOGGER.setDebug(IDL_EXTENSION_CONFIG.debugMode);

  // don't log since we log this in the language server
  // IDL_LOGGER.log({
  //   content: ['IDL configuration updated', IDL_EXTENSION_CONFIG],
  // });

  // alert language server as long as it has started
  if (!LANGUAGE_SERVER_FAILED_START) {
    LANGUAGE_SERVER_MESSENGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.WORKSPACE_CONFIG,
      {
        config: IDL_EXTENSION_CONFIG,
      }
    );
  }
};
