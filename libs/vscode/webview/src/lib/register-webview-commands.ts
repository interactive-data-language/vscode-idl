import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/client';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IDLWebView } from './idl-webview';

// get the command errors from IDL translate
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle webvbiews
 */
export function RegisterWebViewCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering webview commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.WEBVIEW.START, () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.WEBVIEW.START,
        });
        IDLWebView.createOrShow(ctx.extensionPath);
        return true;
      } catch (err) {
        LogCommandError(
          'Error while starting webview',
          err,
          cmdErrors.webview.start
        );
        return false;
      }
    })
  );
}
