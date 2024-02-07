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
 * Reset extension config for running tests to make sure it is always fresh and consistent
 */
export async function ResetSettingsForTests(config: IIDLWorkspaceConfig) {
  /**
   * Top-level config
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.debugMode,
    DEFAULT_IDL_EXTENSION_CONFIG.debugMode,
    SCOPE
  );

  /**
   * IDL config
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.IDL,
    DEFAULT_IDL_EXTENSION_CONFIG.IDL,
    SCOPE
  );

  /**
   * code config
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.code,
    DEFAULT_IDL_EXTENSION_CONFIG.code,
    SCOPE
  );
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.codeFormatting,
    DEFAULT_IDL_EXTENSION_CONFIG.code.formatting,
    SCOPE
  );

  /**
   * Documentation
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.documentation,
    DEFAULT_IDL_EXTENSION_CONFIG.documentation,
    SCOPE
  );

  /**
   * Language server
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.languageServer,
    DEFAULT_IDL_EXTENSION_CONFIG.languageServer,
    SCOPE
  );

  /**
   * Problem reporting
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.problems,
    DEFAULT_IDL_EXTENSION_CONFIG.problems,
    SCOPE
  );

  /**
   * Notebooks
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.notebooks,
    DEFAULT_IDL_EXTENSION_CONFIG.notebooks,
    SCOPE
  );

  /**
   * Questions
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.dontAsk,
    DEFAULT_IDL_EXTENSION_CONFIG.dontAsk,
    SCOPE
  );

  /**
   * Things we show
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.dontShow,
    DEFAULT_IDL_EXTENSION_CONFIG.dontShow,
    SCOPE
  );

  /**
   * Things we show
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.dontShow,
    DEFAULT_IDL_EXTENSION_CONFIG.dontShow,
    SCOPE
  );

  /**
   * Developer
   */
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.developer,
    DEFAULT_IDL_EXTENSION_CONFIG.developer,
    SCOPE
  );
}
