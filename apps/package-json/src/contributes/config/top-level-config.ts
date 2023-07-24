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
 * Registers configuration for top-level preferences
 */
export function AddTopLevelConfig(nls: IPackageNLS) {
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.general%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.debugMode}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.debugMode,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.debugMode,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // save in overall extension config
  EXTENSION_CONFIG.push(ourConfig);
}
