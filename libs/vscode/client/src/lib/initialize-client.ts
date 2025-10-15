import { IDL_LOG } from '@idl/logger';
import { CleanPath } from '@idl/shared/extension';
import { GetVSCodeLocale } from '@idl/shared/node';
import { InitializeTranslation } from '@idl/translation';
import {
  InitializeUsageMetrics,
  SetUsageMetricLogger,
} from '@idl/usage-metrics';
import {
  InitializeClientLogger,
  LoadLanguageConfiguration,
  RegisterClientSharedCommands,
} from '@idl/vscode/client-shared';
import {
  IDL_EXTENSION_CONFIG,
  InitializeExtensionConfig,
  SendPreferenceUsageMetrics,
} from '@idl/vscode/config';
import { InitializeDecorations } from '@idl/vscode/decorations';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { join } from 'path';
import { ExtensionContext } from 'vscode';

import { ON_CONFIG_CHANGES_CLIENT } from './helpers/on-config-changes-client';
import { IInitializeClientResult } from './initialize-client.interface';
import { RegisterClientNodeCommands } from './register-client-node-commands';
import { RegisterCodeCommands } from './register-code-commands';
import { RegisterHoverProvider } from './register-hover-provider';
import {
  LANGUAGE_SERVER_CLIENT,
  LANGUAGE_SERVER_FAILED_START,
  StartLanguageServer,
} from './start-language-server';

/**
 * The folder our extension lives in
 */
export let EXTENSION_FOLDER = '';

/**
 * Folder where our internationalization content lives
 */
export let I18N_FOLDER = '';

/** Path to our pro code that we need for vscode that we need for debugging */
export let VSCODE_PRO_DIR = '';

/** Path to our pro code for notebooks */
export let VSCODE_NOTEBOOK_PRO_DIR = '';

/**
 * Initializes any code/functionality needed for our extension client.
 *
 * This manages creation of, and management of, constants that are exported
 * and shared with other routines.
 *
 * Primarily this handles:
 * - Getting translation for extension client
 * - Listening, and getting, configuration information
 */
export async function InitializeClient(
  ctx: ExtensionContext
): Promise<IInitializeClientResult> {
  InitializeTranslation(GetVSCodeLocale());

  InitializeClientLogger();

  // update folders
  EXTENSION_FOLDER = CleanPath(ctx.extensionPath);
  I18N_FOLDER = join(EXTENSION_FOLDER, 'dist', 'i18n');
  VSCODE_PRO_DIR = join(EXTENSION_FOLDER, 'idl', 'vscode');
  VSCODE_NOTEBOOK_PRO_DIR = join(
    EXTENSION_FOLDER,
    'idl',
    'vscode',
    'notebooks'
  );

  // set language configuration
  LoadLanguageConfiguration();

  /** Dont await - blocking questions asked to client if you do */
  InitializeExtensionConfig(ON_CONFIG_CHANGES_CLIENT);

  // set logging callback for metrics
  SetUsageMetricLogger((ev, payload) => {
    // do nothing because VSCode has a dedicated channel for viewing telemetry
    // and logs it for you
  });

  /**
   * Init usage metrics, they only send information if usage metrics are enabled
   * in VSCode via `VSCodeTelemetryLogger`
   */
  InitializeUsageMetrics();
  SendPreferenceUsageMetrics();

  /**
   * Create document decorations
   */
  InitializeDecorations();

  // update logger configuration and log information about our workspace config
  IDL_LOGGER.setDebug(IDL_EXTENSION_CONFIG.debugMode);

  /**
   * Log basic information about IDL and the preferences
   */
  IDL_LOGGER.log({
    log: IDL_LOG,
    type: 'info',
    content: [
      `IDL directory and path: "${IDL_EXTENSION_CONFIG.IDL.directory}"`,
      IDL_EXTENSION_CONFIG.IDL.path,
    ],
  });

  // register basic commands for our client
  RegisterClientSharedCommands(ctx);
  RegisterClientNodeCommands(ctx);

  // register code commands
  RegisterCodeCommands(ctx);

  // start the language server
  await StartLanguageServer(ctx);

  // register custom hover provider
  RegisterHoverProvider();
  // RegisterCompletionProvider();

  return {
    logger: IDL_LOGGER,
    client: LANGUAGE_SERVER_CLIENT,
    config: IDL_EXTENSION_CONFIG,
    failedStart: LANGUAGE_SERVER_FAILED_START,
  };
}
