import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { IDL_LOGGER } from '@idl/vscode/logger';

/**
 * Callback to manage when configuration changes
 */
export const ON_CONFIG_CHANGES_CLIENT_WEB = () => {
  IDL_LOGGER.setDebug(IDL_EXTENSION_CONFIG.debugMode);
};
