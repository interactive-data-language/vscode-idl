import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { RunCopilotQCTests } from './run-copilot-qc-tests';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle Copilot integration
 */
export function RegisterCopilotCommands(ctx: vscode.ExtensionContext) {
  IDL_LOGGER.log({
    log: IDL_COPILOT_VSCODE_LOG,
    type: 'info',
    content: 'Registering commands',
  });

  // set context key so command palette can show/hide dev-only commands
  vscode.commands.executeCommand(
    'setContext',
    'idl.devMode',
    ctx.extensionMode === vscode.ExtensionMode.Development
  );

  // register QC test command
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.COPILOT.RUN_QC_TESTS,
      async () => {
        try {
          await RunCopilotQCTests();
        } catch (err) {
          LogCommandError(
            'Error while running Copilot QC tests',
            err,
            cmdErrors.copilot.runQCTests
          );
        }
      }
    )
  );
}
