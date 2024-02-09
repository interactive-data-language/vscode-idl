import { IIDLWorkspaceConfig } from '@idl/vscode/config';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';

/**
 * Scope we reset at
 */
const SCOPE = true;

/**
 * Wrapper to correctly set config because of nonsense settings API
 */
async function ResetConfigToDefault(
  config: IIDLWorkspaceConfig,
  key: string,
  obj: { [key: string]: any }
) {
  /** Get keys from the data we need to reset */
  const keys = Object.keys(obj);

  // reset all keys
  for (let i = 0; i < keys.length; i++) {
    const settingsKey = `${key}.${keys[i]}`;

    // make sure exists - we merge with internal settings that are
    // not always exposed
    if (config.has(settingsKey)) {
      await config.update(settingsKey, obj[keys[i]], SCOPE);
    }
  }
}

/**
 * Reset extension config for running tests to make sure it is always fresh and consistent
 */
export async function ResetSettingsForTests(config: IIDLWorkspaceConfig) {
  /**
   * Top-level settings
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.debugMode,
    DEFAULT_IDL_EXTENSION_CONFIG.debugMode,
    SCOPE
  );
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.dontAsk,
    DEFAULT_IDL_EXTENSION_CONFIG.dontAsk,
    SCOPE
  );
  if (config.has(IDL_EXTENSION_CONFIG_KEYS.dontShow)) {
    await config.update(
      IDL_EXTENSION_CONFIG_KEYS.dontShow,
      DEFAULT_IDL_EXTENSION_CONFIG.dontShow,
      SCOPE
    );
  }

  /**
   * Batch reset everything else
   */
  const toReset: [string, { [key: string]: any }][] = [
    [IDL_EXTENSION_CONFIG_KEYS.IDL, DEFAULT_IDL_EXTENSION_CONFIG.IDL],
    [IDL_EXTENSION_CONFIG_KEYS.code, DEFAULT_IDL_EXTENSION_CONFIG.code],
    [
      IDL_EXTENSION_CONFIG_KEYS.documentation,
      DEFAULT_IDL_EXTENSION_CONFIG.documentation,
    ],
    [
      IDL_EXTENSION_CONFIG_KEYS.languageServer,
      DEFAULT_IDL_EXTENSION_CONFIG.languageServer,
    ],
    [IDL_EXTENSION_CONFIG_KEYS.problems, DEFAULT_IDL_EXTENSION_CONFIG.problems],
    [
      IDL_EXTENSION_CONFIG_KEYS.notebooks,
      DEFAULT_IDL_EXTENSION_CONFIG.notebooks,
    ],
    [
      IDL_EXTENSION_CONFIG_KEYS.developer,
      DEFAULT_IDL_EXTENSION_CONFIG.developer,
    ],
  ];

  // reset the settings
  for (let i = 0; i < toReset.length; i++) {
    await ResetConfigToDefault(config, toReset[i][0], toReset[i][1]);
  }
}
