import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/logger';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { SetupCopilotInstructions } from './setup-copilot-instructions';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle Copilot integration
 */
export function RegisterCopilotCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering Copilot commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.COPILOT.SETUP_INSTRUCTIONS,
      async (versionsAreDifferent?: boolean) => {
        try {
          return await SetupCopilotInstructions(versionsAreDifferent);
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
