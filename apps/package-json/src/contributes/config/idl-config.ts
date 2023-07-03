import { LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../configuration.interface';
import { VerifyNLS } from '../helpers/verify-nls';
import { IDL_CONFIG_SCOPE } from './idl-config-scope.interface';
import {
  TranslationFromConfiguration,
  TranslationFromConfigurationChoices,
} from './translation-from-configuration';

/**
 * Registers configuration for  IDL in our extension
 */
export function AddIDLConfig(nls: IPackageNLS) {
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.idl%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // add IDL directory
  ourConfig.properties[
    `${LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.IDLDirectory}`
  ] = {
    type: 'string',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.IDLDirectory,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // IDL path
  ourConfig.properties[
    `${LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.IDLPath}`
  ] = {
    type: 'array',
    default: [],
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.IDLPath,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    items: {
      type: 'string',
      format: 'uri',
    },
  };

  // do we add folders to IDL's path?
  ourConfig.properties[
    `${LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.IDLAddWorkspaceFoldersToPath}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.IDL.addWorkspaceFoldersToPath,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.IDLAddWorkspaceFoldersToPath,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // how do we add folders to IDL's path?
  ourConfig.properties[
    `${LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.IDLAppendOrPrependWorkspaceFolders}`
  ] = {
    enum: ['prepend', 'append'],
    enumDescriptions: TranslationFromConfigurationChoices(
      ['prepend', 'append'],
      nls,
      'enumDescriptions.workspace'
    ),
    default: DEFAULT_IDL_EXTENSION_CONFIG.IDL.appendOrPrependWorkspaceFolders,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.IDLAppendOrPrependWorkspaceFolders,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // // environment variables when launching IDL
  // ourConfig.properties[
  //   `${LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.IDLenvironment}`
  // ] = {
  //   type: 'object',
  //   additionalProperties: {
  //     type: 'string',
  //   },
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.IDLenvironment,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  // };

  // save our extension config
  EXTENSION_CONFIG.push(ourConfig);
}
