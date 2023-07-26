import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { DocsToSimpleNotebook, NOTEBOOK_FOLDER } from '@idl/notebooks';
import { IDL_COMMANDS, IDL_NOTEBOOK_EXTENSION } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  LANGUAGE_SERVER_MESSENGER,
  LogCommandError,
} from '@idl/vscode/client';
import { IRetrieveDocsPayload } from '@idl/vscode/events/messages';
import {
  OpenNotebookInVSCode,
  VSCodeTelemetryLogger,
} from '@idl/vscode/shared';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
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
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.NOTEBOOKS.RESET,
        });

        // make sure we have launched IDL
        if (IDL_NOTEBOOK_CONTROLLER.isStarted()) {
          await IDL_NOTEBOOK_CONTROLLER.reset();
        } else {
          IDL_LOGGER.log({
            type: 'info',
            log: IDL_NOTEBOOK_LOG,
            content: IDL_TRANSLATION.notebooks.notifications.idlNotStarted,
            alert: IDL_TRANSLATION.notebooks.notifications.idlNotStarted,
          });
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
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.NOTEBOOKS.STOP,
        });

        // check if launched
        if (IDL_NOTEBOOK_CONTROLLER.isStarted()) {
          // trigger reset and create promise
          const prom = IDL_NOTEBOOK_CONTROLLER.stop();

          // show startup progress
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              cancellable: false,
              title: IDL_TRANSLATION.notebooks.notifications.stoppingIDL,
            },
            () => {
              return prom;
            }
          );

          // wait for finish
          await prom;
        } else {
          IDL_LOGGER.log({
            type: 'info',
            log: IDL_NOTEBOOK_LOG,
            content: IDL_TRANSLATION.notebooks.notifications.idlNotStarted,
            alert: IDL_TRANSLATION.notebooks.notifications.idlNotStarted,
          });
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

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.HELP_AS_NOTEBOOK,
      async (arg: IRetrieveDocsPayload) => {
        try {
          // make folder if it doesnt exist
          if (!existsSync(NOTEBOOK_FOLDER)) {
            mkdirSync(NOTEBOOK_FOLDER, { recursive: true });
          }

          const file = join(
            NOTEBOOK_FOLDER,
            `docs.${arg.name.toLowerCase().replace(/!:/g, '_')}.${
              arg.type
            }${IDL_NOTEBOOK_EXTENSION}`
          );

          /**
           * Get docs
           */
          const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
            'retrieve-docs',
            arg
          );

          // make notebook and save to disk
          writeFileSync(file, DocsToSimpleNotebook(resp.docs));

          // open the notebook in vscode
          OpenNotebookInVSCode(file, true);

          // return as though we succeeded
          return true;
        } catch (err) {
          LogCommandError(
            'Error stopping notebook',
            err,
            cmdErrors.notebooks.helpAsNotebook
          );
          return false;
        }
      }
    )
  );
}
