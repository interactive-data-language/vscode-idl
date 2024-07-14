import { IDL_CONSOLE, IDL_LOG, LogManager } from '@idl/logger';
import { CleanPath, LOG_LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION, InitializeTranslation } from '@idl/translation';
import {
  InitializeUsageMetrics,
  SetUsageMetricLogger,
} from '@idl/usage-metrics';
import {
  IDL_EXTENSION_CONFIG,
  InitializeExtensionConfig,
  SendPreferenceUsageMetrics,
} from '@idl/vscode/config';
import { InitializeDecorations } from '@idl/vscode/decorations';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { join } from 'path';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IInitializeClientResult } from './initialize-client.interface';
import { LoadLanguageConfiguration } from './language-configuration';
import { CLIENT_LOG_INTERCEPTOR } from './logger/client-log-interceptor';
import { LOG_ALERT_CALLBACK } from './logger/log-alert-callback';
import { RegisterClientCommands } from './register-client-commands';
import { RegisterCodeCommands } from './register-code-commands';
import { RegisterHoverProvider } from './register-hover-provider';
import {
  LANGUAGE_SERVER_CLIENT,
  LANGUAGE_SERVER_FAILED_START,
  LANGUAGE_SERVER_MESSENGER,
  StartLanguageServer,
} from './start-language-server';

/**
 * Output channel that we log information to. This is accessible from
 * the "OUTPUT" tab in VSCode near the console.
 *
 * Depending on if we are developers and tweaking the extension, content doesn't
 * show up here and, instead, appears in the debug console of the parent process
 */
export const IDL_CLIENT_OUTPUT_CHANNEL = vscode.window.createOutputChannel(
  IDL_TRANSLATION.debugger.logs.host,
  LOG_LANGUAGE_NAME
);

/**
 * Output channel for the debug process
 */
export const IDL_DEBUG_OUTPUT_CHANNEL = vscode.window.createOutputChannel(
  IDL_TRANSLATION.debugger.logs.debugHistory,
  LOG_LANGUAGE_NAME
);

/**
 * Our logger to handle logic of logging to disk
 */
export const IDL_LOGGER = new LogManager({
  alert: LOG_ALERT_CALLBACK,
});

/**
 * Replace console logs to capture all content and normalize output logging
 */
console.log = (...args: any[]) => {
  IDL_LOGGER.log({
    log: IDL_CONSOLE,
    content: args,
  });
};
console.warn = (...args: any[]) => {
  IDL_LOGGER.log({
    log: IDL_CONSOLE,
    content: args,
    type: 'warn',
  });
};
console.error = (...args: any[]) => {
  IDL_LOGGER.log({
    log: IDL_CONSOLE,
    content: args,
    type: 'error',
    alert: IDL_TRANSLATION.client.errors.unhandled,
  });
};

/**
 * Check if we are in runtime or development mode (debugging)
 */
if (process.env.VSCODE_IDL_DEBUGGING === 'true') {
  IDL_CLIENT_OUTPUT_CHANNEL.appendLine(
    'Debug mode detected for IDL extension, check debug console of host process'
  );
} else {
  // custom logging to send everything back to the VSCode output window
  IDL_LOGGER.setInterceptor(CLIENT_LOG_INTERCEPTOR);
}

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

  // first, handle translation
  InitializeTranslation();

  // callback for when our configuration changes
  const onConfigChanges = () => {
    IDL_LOGGER.setDebug(IDL_EXTENSION_CONFIG.debugMode);

    // don't log since we log this in the language server
    // IDL_LOGGER.log({
    //   content: ['IDL configuration updated', IDL_EXTENSION_CONFIG],
    // });

    // alert language server as long as it has started
    if (!LANGUAGE_SERVER_FAILED_START) {
      LANGUAGE_SERVER_MESSENGER.sendNotification(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.WORKSPACE_CONFIG,
        {
          config: IDL_EXTENSION_CONFIG,
        }
      );
    }
  };

  // set logging callback for metrics
  SetUsageMetricLogger((ev, payload) => {
    // do nothing because VSCode has a dedicated channel for viewing telemetry
    // and logs it for you
  });

  // manage the extension configuration
  InitializeExtensionConfig(onConfigChanges);

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
  RegisterClientCommands(ctx);

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
