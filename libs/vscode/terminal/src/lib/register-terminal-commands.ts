import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { SendCommandToIDLTerminal } from './idl-terminal';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle terminal interaction
 */
export function RegisterTerminalCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering terminal commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.START, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.TERMINAL.START,
        });
        LogCommandInfo('Starting IDL terminal');
        await SendCommandToIDLTerminal({ label: 'Open' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while starting IDL',
          err,
          cmdErrors.terminal.startIDL,
        );
        return false;
      }
    }),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.COMPILE, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.TERMINAL.COMPILE,
        });
        LogCommandInfo('Compiling file in IDL terminal');
        return await SendCommandToIDLTerminal({ label: 'Compile' });
      } catch (err) {
        LogCommandError(
          'Error while compiling file in IDL terminal',
          err,
          cmdErrors.terminal.compileFile,
        );
        return false;
      }
    }),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.RUN, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.TERMINAL.RUN,
        });
        LogCommandInfo('Running file in terminal');
        return await SendCommandToIDLTerminal({ label: 'Run' });
      } catch (err) {
        LogCommandError(
          'Error while running file in IDL terminal',
          err,
          cmdErrors.terminal.runFile,
        );
        return false;
      }
    }),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.EXECUTE_BATCH,
      async () => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.TERMINAL.EXECUTE_BATCH,
          });
          LogCommandInfo('Execute batch file in IDL terminal');
          return await SendCommandToIDLTerminal({ label: 'Execute' });
        } catch (err) {
          LogCommandError(
            'Error while executing batch file in IDL terminal',
            err,
            cmdErrors.terminal.executeBatchFile,
          );
          return false;
        }
      },
    ),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.RESET, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.TERMINAL.RESET,
        });
        LogCommandInfo('Reset IDL');
        await SendCommandToIDLTerminal({ label: 'Reset' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while resetting IDL',
          err,
          cmdErrors.terminal.resetIDL,
        );
        return false;
      }
    }),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.PAUSE, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.TERMINAL.PAUSE,
        });
        LogCommandInfo('Stopping execution in IDL terminal');
        await SendCommandToIDLTerminal({ label: 'Stop' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while stopping IDL',
          err,
          cmdErrors.terminal.pauseExecution,
        );
        return false;
      }
    }),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.CONTINUE,
      async () => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.TERMINAL.CONTINUE,
          });
          LogCommandInfo('Continue execution in IDL terminal');
          await SendCommandToIDLTerminal({ label: 'Continue' });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while continuing execution in IDL terminal',
            err,
            cmdErrors.terminal.continueExecution,
          );
          return false;
        }
      },
    ),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.TERMINAL.STEP_IN, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.TERMINAL.STEP_IN,
        });
        LogCommandInfo('Step in IDL terminal');
        await SendCommandToIDLTerminal({ label: 'Step In' });
        return true;
      } catch (err) {
        LogCommandError(
          'Error while stepping in IDL terminal',
          err,
          cmdErrors.terminal.stepIn,
        );
        return false;
      }
    }),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.STEP_OVER,
      async () => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.TERMINAL.STEP_OVER,
          });
          LogCommandInfo('Step over IDL terminal');
          await SendCommandToIDLTerminal({ label: 'Step Over' });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while stepping over in IDL terminal',
            err,
            cmdErrors.terminal.stepOver,
          );
          return false;
        }
      },
    ),
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TERMINAL.STEP_OUT,
      async () => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.TERMINAL.STEP_OUT,
          });
          LogCommandInfo('Step out IDL terminal');
          await SendCommandToIDLTerminal({ label: 'Step Out' });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while stepping out of IDL terminal',
            err,
            cmdErrors.terminal.stepOut,
          );
          return false;
        }
      },
    ),
  );
}
