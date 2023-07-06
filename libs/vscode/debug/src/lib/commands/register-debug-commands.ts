import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/client';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { IDLWebView } from '@idl/vscode/webview';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { CompileFile } from './compile-file';
import { ExecuteFile } from './execute-file';
import { StartProfiling, StopProfiling } from './profiling';
import { ResetIDL } from './reset';
import { RunFile } from './run-file';
import { StartIDL, VerifyIDLHasStarted } from './start-idl';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle terminal interaction
 */
export function RegisterDebugCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering debug commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.DEBUG.START, async () => {
      try {
        LogCommandInfo('Opening IDL');
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.DEBUG.START,
        });
        await StartIDL();
        return true;
      } catch (err) {
        LogCommandError(
          'Error while opening IDL',
          err,
          cmdErrors.debug.startIDL
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.DEBUG.COMPILE, async () => {
      try {
        if (!VerifyIDLHasStarted(true)) {
          return false;
        }
        LogCommandInfo('Compiling file');
        await CompileFile();
        return true;
      } catch (err) {
        LogCommandError(
          'Error while compiling file for IDL',
          err,
          cmdErrors.debug.compileFile
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.DEBUG.RUN, async () => {
      try {
        if (!VerifyIDLHasStarted(true)) {
          return false;
        }
        LogCommandInfo('Running file');
        await RunFile();
        return true;
      } catch (err) {
        LogCommandError(
          'Error while running file for IDL',
          err,
          cmdErrors.debug.runFile
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.DEBUG.EXECUTE_BATCH,
      async () => {
        try {
          if (!VerifyIDLHasStarted(true)) {
            return false;
          }
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.DEBUG.START,
          });
          LogCommandInfo('Execute Batch File');
          await ExecuteFile();
          return true;
        } catch (err) {
          LogCommandError(
            'Error while executing batch file',
            err,
            cmdErrors.debug.executeBatchFile
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.DEBUG.RESET, async () => {
      try {
        if (!VerifyIDLHasStarted(true)) {
          return false;
        }
        LogCommandInfo('Reset IDL');
        await ResetIDL();
        return true;
      } catch (err) {
        LogCommandError(
          'Error while resetting IDL',
          err,
          cmdErrors.debug.resetIDL
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.DEBUG.PROFILER_START,
      async () => {
        try {
          if (!VerifyIDLHasStarted(true)) {
            return false;
          }
          LogCommandInfo('Start Profiling');
          LogCommandInfo('Opening IDL');
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.DEBUG.PROFILER_START,
          });
          StartProfiling();
          return true;
        } catch (err) {
          LogCommandError(
            'Error while starting profiling',
            err,
            cmdErrors.debug.startProfiling
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.DEBUG.PROFILER_STOP,
      async () => {
        try {
          if (!VerifyIDLHasStarted(true)) {
            return false;
          }
          LogCommandInfo('Stop Profiling');
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.DEBUG.PROFILER_STOP,
          });
          const strings = await StopProfiling();
          IDLWebView.createOrShow(ctx.extensionPath);
          const panel = IDLWebView.currentPanel;
          panel.sendCommand({ command: 'profiler', data: strings });
          return true;
        } catch (err) {
          LogCommandError(
            'Error while stopping profiling',
            err,
            cmdErrors.debug.stopProfiling
          );
          return false;
        }
      }
    )
  );
}
