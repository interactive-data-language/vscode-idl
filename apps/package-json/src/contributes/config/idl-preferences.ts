import { IDL_LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../contributes-configuration.interface';
import { IDL_CONFIG_SCOPE } from './idl-config-scope.interface';
import {
  TranslationFromConfiguration,
  TranslationFromConfigurationChoices,
} from './translation-from-configuration';

/**
 * Registers configuration for code in our IDL extension
 */
export function AddIDLPreferences(nls: IPackageNLS) {
  /** Base key for IDL preferences */
  const keyBase = IDL_EXTENSION_CONFIG_KEYS.IDLPreferences;

  // should our extension run in debug mode
  EXTENSION_CONFIG[`${IDL_LANGUAGE_NAME}.${keyBase}`] = {
    type: 'object',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.IDLPreferences,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    additionalProperties: false,
    default: DEFAULT_IDL_EXTENSION_CONFIG.code.formattingStyle,
    properties: {
      quotes: {
        type: 'string',
        description: TranslationFromConfiguration('quotes', nls, keyBase),
        enum: ['single', 'double', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['single', 'double', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      methods: {
        type: 'string',
        description: TranslationFromConfiguration('methods', nls, keyBase),
        enum: ['dot', 'arrow', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['dot', 'arrow', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      keywords: {
        type: 'string',
        description: TranslationFromConfiguration('keywords', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      properties: {
        type: 'string',
        description: TranslationFromConfiguration('properties', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      control: {
        type: 'string',
        description: TranslationFromConfiguration('control', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      numbers: {
        type: 'string',
        description: TranslationFromConfiguration('numbers', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      hex: {
        type: 'string',
        description: TranslationFromConfiguration('hex', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      octal: {
        type: 'string',
        description: TranslationFromConfiguration('octal', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      binary: {
        type: 'string',
        description: TranslationFromConfiguration('binary', nls, keyBase),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      systemVariables: {
        type: 'string',
        description: TranslationFromConfiguration(
          'systemVariables',
          nls,
          keyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      internalRoutines: {
        type: 'string',
        description: TranslationFromConfiguration(
          'internalRoutines',
          nls,
          keyBase
        ),
        enum: ['match', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      userRoutines: {
        type: 'string',
        description: TranslationFromConfiguration('userRoutines', nls, keyBase),
        enum: ['match', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      localVariables: {
        type: 'string',
        description: TranslationFromConfiguration(
          'localVariables',
          nls,
          keyBase
        ),
        enum: ['match', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
    },
  };
}
