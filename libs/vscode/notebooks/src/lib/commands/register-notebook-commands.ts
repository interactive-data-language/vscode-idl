import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/client';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IDL_NOTEBOOK_CONTROLLER } from '../initialize-notebooks';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle terminal interaction
 */
export function RegisterNotebookCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering notebook commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.NOTEBOOKS.RESET, async () => {
      try {
        LogCommandInfo('Reset notebook');
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.NOTEBOOKS.RESET,
        });
        if (IDL_NOTEBOOK_CONTROLLER.launched) {
          IDL_NOTEBOOK_CONTROLLER._runtime.evaluate('.reset');
        }
        return true;
      } catch (err) {
        LogCommandError(
          'Error resetting notebook',
          err,
          cmdErrors.notebooks.resetIDL
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.NOTEBOOKS.STOP, async () => {
      try {
        LogCommandInfo('Stop notebook');
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.NOTEBOOKS.STOP,
        });
        if (IDL_NOTEBOOK_CONTROLLER.launched) {
          IDL_NOTEBOOK_CONTROLLER.stop();
        }
        return true;
      } catch (err) {
        LogCommandError(
          'Error stopping notebook',
          err,
          cmdErrors.notebooks.stopIDL
        );
        return false;
      }
    })
  );
}
