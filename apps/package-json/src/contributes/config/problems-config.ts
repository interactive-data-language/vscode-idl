import { IDL_LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../configuration.interface';
import { IDLProblemCodeEnumAndTranslations } from '../helpers/enum-and-translations';
import { VerifyNLS } from '../helpers/verify-nls';
import { IDL_CONFIG_SCOPE } from './idl-config-scope.interface';
import { TranslationFromConfiguration } from './translation-from-configuration';

/**
 * Adds config for problem reporting to the extension
 */
export function AddProblemsConfig(nls: IPackageNLS) {
  // root folder
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.problems%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // folders to not ask to init config for
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.problemsIncludeProblemsFromIDLPath}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.problems.includeProblemsFromIDLPath,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.problemsIncludeProblemsFromIDLPath,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // folders to not ask to init config for
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.problemsIncludeProblemsFromIDLPackages}`
  ] = {
    type: 'boolean',
    default:
      DEFAULT_IDL_EXTENSION_CONFIG.problems.includeProblemsFromIDLPackages,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.problemsIncludeProblemsFromIDLPackages,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // folders to not ask to init config for
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.problemsReportDocsProblems}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.problems.reportDocsProblems,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.problemsReportDocsProblems,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // problem codes to ignore
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.problemsIgnoreProblems}`
  ] = {
    type: 'array',
    default: [],
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.problemsIgnoreProblems,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    uniqueItems: true,
    items: {
      type: ['string'],
    },
  };

  IDLProblemCodeEnumAndTranslations(
    ourConfig.properties[
      `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.problemsIgnoreProblems}`
    ]
  );

  EXTENSION_CONFIG.push(ourConfig);
}
