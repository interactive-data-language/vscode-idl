import { FindIDL } from '@idl/idl';
import { CleanPath, EXTENSION_FULL_NAME, IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { VSCODE_COMMANDS, VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { URI } from 'vscode-uri'; // handle URI to file system and back

import { IDL_CLIENT_OUTPUT_CHANNEL, IDL_LOGGER } from './initialize-client';
import { LogCommandError, LogCommandInfo } from './logger/logger-helpers';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle misc commands
 */
export function RegisterClientCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering client lib commands' });

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
      IDL_COMMANDS.CONFIG.IDL_DIR_USER,
      async () => {
        try {
          LogCommandInfo('Specify IDL directory (User)');

          // get IDL folder
          const idlDir = FindIDL();

          const res = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            openLabel: 'Specify IDL Directory (User)',
            defaultUri: idlDir !== undefined ? URI.file(idlDir) : undefined,
          });

          // make sure we found something
          if (res === undefined) {
            return;
          }
          if (res.length === 0) {
            return;
          }

          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CONFIG.IDL_DIR_USER,
          });

          const parsed = URI.parse(res[0].path);
          IDL_EXTENSION_CONFIG.update(
            IDL_EXTENSION_CONFIG_KEYS.IDLDirectory,
            CleanPath(parsed.fsPath),
            true
          );
        } catch (err) {
          LogCommandError(
            'Error while setting IDL directory (User)',
            err,
            cmdErrors.config.specifyIDLDirectory
          );
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CONFIG.IDL_DIR_WORKSPACE,
      async () => {
        try {
          LogCommandInfo('Specify IDL directory (Workspace)');

          // get IDL folder
          const idlDir = FindIDL();

          const res = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            openLabel: 'Specify IDL Directory (Workspace)',
            defaultUri: idlDir !== undefined ? URI.file(idlDir) : undefined,
          });

          // make sure we found something
          if (res === undefined) {
            return;
          }
          if (res.length === 0) {
            return;
          }

          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CONFIG.IDL_DIR_WORKSPACE,
          });

          const parsed = URI.parse(res[0].path);
          IDL_EXTENSION_CONFIG.update(
            IDL_EXTENSION_CONFIG_KEYS.IDLDirectory,
            CleanPath(parsed.fsPath),
            false
          );
        } catch (err) {
          LogCommandError(
            'Error while setting IDL directory (Workspace)',
            err,
            cmdErrors.config.specifyIDLDirectoryWorkspace
          );
        }
      }
    )
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
