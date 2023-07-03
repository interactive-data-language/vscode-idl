import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  ILanguageServerConfig,
} from '@idl/vscode/extension-config';
import copy from 'fast-copy';

/**
 * Default settings for our server
 */
export const DEFAULT_SERVER_SETTINGS: ILanguageServerConfig = copy(
  DEFAULT_IDL_EXTENSION_CONFIG.languageServer
);
