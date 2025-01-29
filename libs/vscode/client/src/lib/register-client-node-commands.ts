import { CleanPath } from '@idl/idl/files';
import { FindIDL } from '@idl/idl/idl-process';
import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import {
  IDL_LOGGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { URI } from 'vscode-uri'; // handle URI to file system and back

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle misc commands
 */
export function RegisterClientNodeCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering client node commands' });

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
}
