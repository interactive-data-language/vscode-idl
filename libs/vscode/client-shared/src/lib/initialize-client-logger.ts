import { LOG_LANGUAGE_NAME } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, InitializeLogger } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { CLIENT_LOG_INTERCEPTOR } from './logger/client-log-interceptor';
import { LOG_ALERT_CALLBACK } from './logger/log-alert-callback';

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
 * Sets up logging int eh extension
 *
 * Registers the callbacks for alerts from our logging system and
 * also manages opening dialogs in VSCode to show potential actions
 * to users.
 */
export function InitializeClientLogger() {
  // initialize logging
  InitializeLogger(LOG_ALERT_CALLBACK);

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
}
