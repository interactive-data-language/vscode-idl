import { IDL_LANGUAGE_NAME } from '@idl/shared/extension';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../contributes-configuration.interface';
import { VerifyNLS } from '../helpers/verify-nls';
import { TranslationFromConfiguration } from './translation-from-configuration';

/**
 * Registers configuration for GitHub Copilot integration
 */
export function AddCopilotConfig(nls: IPackageNLS) {
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.copilot%',
    additionalProperties: false,
    properties: {} as { [key: string]: any },
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // custom instructions
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.copilotCustomInstructions}`
  ] = {
    type: 'string',
    default: DEFAULT_IDL_EXTENSION_CONFIG.copilot.customInstructions,
    editPresentation: 'multilineText',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.copilotCustomInstructions,
      nls,
    ),
    scope: 'machine',
  };

  // save in overall extension config
  EXTENSION_CONFIG.push(ourConfig);
}
