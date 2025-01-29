import { EXTENSION_FULL_NAME, IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { VSCODE_COMMANDS } from '@idl/types/vscode';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

// handle URI to file system and back
import { IDL_CLIENT_OUTPUT_CHANNEL } from './initialize-client-logger';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle misc commands
 */
export function RegisterClientSharedCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering client shared commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CLIENT.REPORT_PROBLEM,
      async () => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CLIENT.REPORT_PROBLEM,
          });

          await vscode.env.openExternal(
            vscode.Uri.parse(
              'https://github.com/interactive-data-language/vscode-idl/issues/new/choose'
            )
          );
        } catch (err) {
          LogCommandError(
            'Error while filing a bug',
            err,
            cmdErrors.client.fileABug
          );
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.CLIENT.VIEW_LOGS, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.CLIENT.VIEW_LOGS,
        });
        IDL_CLIENT_OUTPUT_CHANNEL.show();
      } catch (err) {
        LogCommandError('Error showing logs', err, cmdErrors.client.viewLogs);
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CLIENT.VIEW_SETTING,
      async () => {
        try {
          LogCommandInfo('View preferences');

          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CLIENT.VIEW_SETTING,
          });

          vscode.commands.executeCommand(
            VSCODE_COMMANDS.OPEN_SETTINGS,
            /**
             * Use search input box to find this syntax. If you type "@" in settings, you'll
             * see more options too
             */
            `@ext: ${EXTENSION_FULL_NAME}`
          );
        } catch (err) {
          LogCommandError(
            'Error while viewing preferences',
            err,
            cmdErrors.config.specifyIDLDirectoryWorkspace
          );
        }
      }
    )
  );
}
