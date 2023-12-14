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
 * Registers configuration for code in our IDL extension
 */
export function AddDeveloperConfig(nls: IPackageNLS) {
  // root folder
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.developer%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // // preference to ask or not ask about the IDL directory
  // ourConfig.properties[
  //   `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.developerIDL}`
  // ] = {
  //   type: 'boolean',
  //   default: false,
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.developerIDL,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  // };

  // // preference to ask or not ask about the IDL directory
  // ourConfig.properties[
  //   `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.developerENVI}`
  // ] = {
  //   type: 'boolean',
  //   default: false,
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.developerENVI,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  // };

  // // preference to ask or not ask about changing the default formatter
  // ourConfig.properties[
  //   `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.developerENVIDeepLearning}`
  // ] = {
  //   type: 'boolean',
  //   default: false,
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.developerENVIDeepLearning,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  // };

  // // folders to not ask to init config for
  // ourConfig.properties[
  //   `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.developerENVIMachineLearning}`
  // ] = {
  //   type: 'boolean',
  //   default: false,
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.developerENVIMachineLearning,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  // };

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.developer}`
  ] = {
    type: 'object',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.developer,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    additionalProperties: false,
    default: DEFAULT_IDL_EXTENSION_CONFIG.developer,
    properties: {
      IDL: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.developerIDL,
          nls
        ),
      },
      ENVI: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.developerENVI,
          nls
        ),
      },
      ENVIDeepLearning: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.developerENVIDeepLearning,
          nls
        ),
      },
      ENVIMachineLearning: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.developerENVIMachineLearning,
          nls
        ),
      },
    },
  };

  // save our config
  EXTENSION_CONFIG.push(ourConfig);
}
