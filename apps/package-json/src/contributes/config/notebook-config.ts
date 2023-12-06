import { IDL_LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../configuration.interface';
import { VerifyNLS } from '../helpers/verify-nls';
import { IDL_CONFIG_SCOPE } from './idl-config-scope.interface';
import { TranslationFromConfiguration } from './translation-from-configuration';

/**
 * Registers configuration for notebooks
 */
export function AddNotebookConfig(nls: IPackageNLS) {
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.notebooks%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.notebooksEmbedGraphics}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.notebooks.embedGraphics,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.notebooksEmbedGraphics,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.notebooksQuietMode}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.notebooks.quietMode,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.notebooksQuietMode,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // save in overall extension config
  EXTENSION_CONFIG.push(ourConfig);
}
