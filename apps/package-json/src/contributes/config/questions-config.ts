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
 * Registers configuration for code in our IDL extension
 */
export function AddQuestionsConfig(nls: IPackageNLS) {
  // root folder
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.questions%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.dontAsk}`
  ] = {
    type: 'object',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.dontAsk,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    additionalProperties: false,
    default: DEFAULT_IDL_EXTENSION_CONFIG.dontAsk,
    properties: {
      forIDLDir: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.dontAskForIDLDir,
          nls
        ),
      },
      forIconChange: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.dontAskForIconChange,
          nls
        ),
      },
      forFormatterChange: {
        type: 'boolean',
        default: false,
        description: TranslationFromConfiguration(
          IDL_EXTENSION_CONFIG_KEYS.dontAskForFormatterChange,
          nls
        ),
      },
      // toInitConfig: {
      //   type: 'boolean',
      //   default: false,
      //   description: TranslationFromConfiguration(
      //     IDL_EXTENSION_CONFIG_KEYS.dontAskToInitConfig,
      //     nls
      //   ),
      // },
      // toInitConfigForTheseFolders: {
      //   type: 'array',
      //   default: [],
      //   description: TranslationFromConfiguration(
      //     IDL_EXTENSION_CONFIG_KEYS.dontAskToInitConfigForTheseFolders,
      //     nls
      //   ),
      //   items: {
      //     type: 'string',
      //     format: 'uri',
      //   },
      // },
    },
  };

  // /**
  //  * This item is separate because you can't edit it in the setting UI
  //  */
  //   // folders to not ask to init config for
  // ourConfig.properties[
  //   `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.dontAskToInitConfigForTheseFolders}`
  // ] = {
  //   type: 'array',
  //   default: [],
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.dontAskToInitConfigForTheseFolders,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  //   items: {
  //     type: 'string',
  //     format: 'uri',
  //   },
  // };

  // // should our extension run in debug mode
  // ourConfig.properties[
  //   `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.dontShow}`
  // ] = {
  //   type: 'object',
  //   description: TranslationFromConfiguration(
  //     IDL_EXTENSION_CONFIG_KEYS.dontShow,
  //     nls
  //   ),
  //   scope: IDL_CONFIG_SCOPE,
  //   additionalProperties: false,
  //   default: DEFAULT_IDL_EXTENSION_CONFIG.dontShow,
  //   properties: {
  //     welcomePage: {
  //       type: 'boolean',
  //       default: false,
  //       description: TranslationFromConfiguration(
  //         IDL_EXTENSION_CONFIG_KEYS.dontShowWelcomePage,
  //         nls
  //       ),
  //     },
  //   },
  // };

  EXTENSION_CONFIG.push(ourConfig);
}
