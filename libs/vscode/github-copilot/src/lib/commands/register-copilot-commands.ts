import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { SetupCopilotInstructions } from './setup-copilot-instructions';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle Copilot integration
 */
export function RegisterCopilotCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({
    log: IDL_COPILOT_VSCODE_LOG,
    type: 'info',
    content: 'Registering commands',
  });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.COPILOT.SETUP_INSTRUCTIONS,
      async (versionsAreDifferent?: boolean) => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.COPILOT.SETUP_INSTRUCTIONS,
          });

          return await SetupCopilotInstructions(ctx, versionsAreDifferent);
        } catch (err) {
          LogCommandError(
            'Error while setting up Copilot instructions',
            err,
            cmdErrors.copilot.setupInstructions
          );
          return false;
        }
      }
    )
  );
}
