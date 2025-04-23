import { IDL_LANGUAGE_NAME } from '@idl/shared/extension';
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
 * Registers configuration for our MCP server
 */
export function AddMCPConfig(nls: IPackageNLS) {
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.mcp%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // should we launch our MCP server?
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.mcpEnabled}`
  ] = {
    type: 'boolean',
    default: DEFAULT_IDL_EXTENSION_CONFIG.mcp.enabled,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.mcpEnabled,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
  };

  // what port should our MCP server start on
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.mcpPort}`
  ] = {
    type: 'number',
    default: DEFAULT_IDL_EXTENSION_CONFIG.mcp.port,
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.mcpPort,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    minimum: 1024,
    maximum: 65535,
  };

  // save in overall extension config
  EXTENSION_CONFIG.push(ourConfig);
}
