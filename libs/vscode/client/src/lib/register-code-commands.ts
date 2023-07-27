import { CleanPath, IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import {
  GetActivePROCodeOrTaskWindow,
  GetActivePROCodeWindow,
  VSCodeTelemetryLogger,
} from '@idl/vscode/shared';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

// handle URI to file system and back
import { IDL_LOGGER } from './initialize-client';
import { LogCommandError, LogCommandInfo } from './logger/logger-helpers';
import { LANGUAGE_SERVER_MESSENGER } from './start-language-server';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle code
 */
export function RegisterCodeCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering code commands' });

  // ctx.subscriptions.push(
  //   vscode.commands.registerCommand(
  //     IDL_COMMANDS.CODE.INITIALIZE_CONFIG,
  //     async () => {
  //       try {
  //         LogCommandInfo('Initialize config');

  //         /**
  //          * Get workspace folders
  //          */
  //         const folders = vscode.workspace.workspaceFolders;

  //         // make sure we have workspace folders
  //         if (folders === undefined) {
  //           vscode.window.showInformationMessage(
  //             IDL_TRANSLATION.commands.notifications.initConfig.noWorkspaceOpen
  //           );
  //         } else {
  //           // filter out folders that have existing idl.json
  //           const checkFolders = folders
  //             .map((folder) => CleanPath(folder.uri.fsPath))
  //             .filter(
  //               (folder) =>
  //                 !existsSync(join(folder, IDL_JSON_URI))
  //             );

  //           // check if we have a special folder
  //           if (checkFolders.length === 0) {
  //             vscode.window.showInformationMessage(
  //               IDL_TRANSLATION.commands.notifications.initConfig
  //                 .allWorkspacesHaveConfig
  //             );
  //           } else {
  //             // target is what we return
  //             const res = await vscode.window.showQuickPick(
  //               checkFolders.map((folder) => {
  //                 return {
  //                   label: basename(folder),
  //                   description: folder,
  //                   target: folder, // return value
  //                 };
  //               }),
  //               {
  //                 title:
  //                   IDL_TRANSLATION.commands.notifications.initConfig
  //                     .dialogTitle,
  //                 canPickMany: false,
  //               }
  //             );

  //             // make sure we have a folder
  //             if (res !== undefined) {
  //               VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
  //                 idl_command: IDL_COMMANDS.CODE.INITIALIZE_CONFIG,
  //               });

  //               LANGUAGE_SERVER_MESSENGER.sendNotification(
  //                 LANGUAGE_SERVER_MESSAGE_LOOKUP.INIT_WORKSPACE_CONFIG,
  //                 { folder: res.target }
  //               );
  //             }
  //           }
  //         }
  //       } catch (err) {
  //         LogCommandError(
  //           'Error while executing command to initialize "idl.json" files in workspace',
  //           err,
  //           cmdErrors.code.initializeConfig
  //         );
  //       }
  //     }
  //   )
  // );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CODE.ADD_DOCS_TO_FILE,
      async () => {
        try {
          LogCommandInfo('Add docs');

          // check for PRO file
          const file = GetActivePROCodeWindow();

          // make sure we have a file
          if (file !== undefined) {
            VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
              idl_command: IDL_COMMANDS.CODE.ADD_DOCS_TO_FILE,
            });

            LANGUAGE_SERVER_MESSENGER.sendNotification(
              LANGUAGE_SERVER_MESSAGE_LOOKUP.ADD_DOCS,
              { file: CleanPath(file.uri.fsPath) }
            );
          }
        } catch (err) {
          LogCommandError(
            'Error while adding docs to file',
            err,
            cmdErrors.code.addDocsToFile
          );
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.CODE.FORMAT_FILE, async () => {
      try {
        LogCommandInfo('Format file');

        // check for PRO file
        const file = GetActivePROCodeOrTaskWindow();

        // make sure we have a file
        if (file !== undefined) {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CODE.FORMAT_FILE,
          });

          LANGUAGE_SERVER_MESSENGER.sendNotification(
            LANGUAGE_SERVER_MESSAGE_LOOKUP.FORMAT_FILE,
            {
              textDocument: {
                uri: file.uri.toString(),
              },
              // unused, we default to idl.json config, but this is required
              options: {
                insertSpaces: true,
                tabSize: 2,
              },
            }
          );
        }
      } catch (err) {
        LogCommandError(
          'Error while formatting file',
          err,
          cmdErrors.code.formatFile
        );
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CODE.GENERATE_TASK,
      async () => {
        try {
          LogCommandInfo('Generate task');

          // check for PRO file
          const file = GetActivePROCodeWindow();

          // make sure we have a file
          if (file !== undefined) {
            // target is what we return
            const res = await vscode.window.showQuickPick(
              [
                {
                  label: 'ENVI',
                  description: 'ENVI Task',
                  target: 'envi', // return value
                },
                {
                  label: 'IDL',
                  description: 'IDL Task',
                  target: 'idl', // return value
                },
              ],
              {
                title:
                  IDL_TRANSLATION.commands.notifications.initTask.dialogTitle,
                canPickMany: false,
              }
            );

            // make sure we have a folder
            if (res !== undefined) {
              VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
                idl_command: `${IDL_COMMANDS.CODE.GENERATE_TASK}:${res.target}`,
              });
              LANGUAGE_SERVER_MESSENGER.sendNotification(
                LANGUAGE_SERVER_MESSAGE_LOOKUP.GENERATE_TASK,
                {
                  uri: file.uri.toString(),
                  type: res.target as 'idl' | 'envi',
                }
              );
            }
          }
        } catch (err) {
          LogCommandError(
            'Error while generating task',
            err,
            cmdErrors.code.formatFile
          );
        }
      }
    )
  );
}
