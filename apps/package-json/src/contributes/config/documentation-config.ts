import { IDL_LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../contributes-configuration.interface';
import { VerifyNLS } from '../helpers/verify-nls';
import { IDL_CONFIG_SCOPE } from './idl-config-scope.interface';
import { TranslationFromConfiguration } from './translation-from-configuration';

/**
 * Registers configuration for documentation
 */
export function AddDocumentationConfig(nls: IPackageNLS) {
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.documentation%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.documentationUseOnline}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.documentation.useOnline,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.documentationUseOnline,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.documentationLocalPort}`
  ] = {
    type: 'number',
    default: DEFAULT_IDL_EXTENSION_CONFIG.documentation.localPort,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.documentationLocalPort,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    minimum: 1024,
    maximum: 65535,
  };

  // save in overall extension config
  EXTENSION_CONFIG.push(ourConfig);
}
