import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDL_LOGGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { SendCommandToIDLTerminal } from './idl-terminal';

// get the command errors from IDL translatyion
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle terminal interaction
 */
export function RegisterTerminalCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering terminal commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.START, async () => {
      try {
        LogCommandInfo('Opening IDL terminal');
        await SendCommandToIDLTerminal({ label: 'Open' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while opening IDL terminal',
          err,
          cmdErrors.terminal.openIDL
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.COMPILE, async () => {
      try {
        LogCommandInfo('Compiling file in IDL terminal');
        return await SendCommandToIDLTerminal({ label: 'Compile' });
      } catch (err) {
        LogCommandError(
          'Error while compiling file in IDL terminal',
          err,
          cmdErrors.terminal.compileFile
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.RUN, async () => {
      try {
        LogCommandInfo('Running file in terminal');
        return await SendCommandToIDLTerminal({ label: 'Run' });
      } catch (err) {
        LogCommandError(
          'Error while running file in IDL temrinal',
          err,
          cmdErrors.terminal.runFile
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.EXECUTE_BATCH,
      async () => {
        try {
          LogCommandInfo('Execute batch file in IDL terminal');
          return await SendCommandToIDLTerminal({ label: 'Execute' });
        } catch (err) {
          LogCommandError(
            'Error while executing batch file in IDL temrinal',
            err,
            cmdErrors.terminal.executeBatchFile
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.RESET, async () => {
      try {
        LogCommandInfo('Reset IDL');
        await SendCommandToIDLTerminal({ label: 'Reset' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while resetting IDL',
          err,
          cmdErrors.terminal.resetIDL
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.STOP, async () => {
      try {
        LogCommandInfo('Stopping execution in IDL terminal');
        await SendCommandToIDLTerminal({ label: 'Stop' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while stopping IDL',
          err,
          cmdErrors.terminal.stopExecution
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.CONTINUE,
      async () => {
        try {
          LogCommandInfo('Continue execution in IDL terminal');
          await SendCommandToIDLTerminal({ label: 'Continue' });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while continuing execution in IDL temrinal',
            err,
            cmdErrors.terminal.continueExecution
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.STEP_IN, async () => {
      try {
        LogCommandInfo('Step in IDL terminal');
        await SendCommandToIDLTerminal({ label: 'Step In' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while steping in IDL terminal',
          err,
          cmdErrors.terminal.stepIn
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.STEP_OVER,
      async () => {
        try {
          LogCommandInfo('Step over IDL terminal');
          await SendCommandToIDLTerminal({ label: 'Step Over' });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while stepping over in IDL terminal',
            err,
            cmdErrors.terminal.stepOver
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.STEP_OUT,
      async () => {
        try {
          LogCommandInfo('Step out IDL terminal');
          await SendCommandToIDLTerminal({ label: 'Step Out' });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while stepping out of IDL terminal',
            err,
            cmdErrors.terminal.stepOut
          );
          return false;
        }
      }
    )
  );
}
