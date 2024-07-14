import { MIGRATION_TYPE_LOOKUP } from '@idl/assembling/migrators-types';
import { IDL_COMMAND_LOG } from '@idl/logger';
import { CleanPath, IDL_COMMANDS, IDL_LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IAutoFixIDLDiagnostic } from '@idl/types/diagnostic';
import {
  AutoFixProblem,
  IDL_PROBLEM_CODE_ALIAS_LOOKUP,
} from '@idl/types/problem-codes';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import {
  GetActiveIDLNotebookWindow,
  GetActivePROCodeOrTaskWindow,
  GetActivePROCodeWindow,
  ReplaceDocumentContent,
  VSCodeTelemetryLogger,
} from '@idl/vscode/shared';
import { basename } from 'path';
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
            'Error while adding docs to file',
            err,
            cmdErrors.code.addDocsToFile
          );
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
      async (info?: IAutoFixIDLDiagnostic) => {
        try {
          if (!info) {
            return false;
          }

          LogCommandInfo('Disable problem via settings');

          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
          });

          /** Get problem code alias */
          const alias = IDL_PROBLEM_CODE_ALIAS_LOOKUP[info.code];

          /** Get current problems */
          const current = IDL_EXTENSION_CONFIG.problems.ignoreProblems;
          if (current.indexOf(alias) !== -1) {
            return false;
          }

          // save the problem code
          current.push(alias);

          // get current config
          const configuration =
            vscode.workspace.getConfiguration(IDL_LANGUAGE_NAME);

          // update our value
          await configuration.update(
            IDL_EXTENSION_CONFIG_KEYS.problemsIgnoreProblems,
            current,
            info.scope === 'user'
              ? vscode.ConfigurationTarget.Global
              : vscode.ConfigurationTarget.Workspace
          );

          return true;
        } catch (err) {
          LogCommandError(
            'Error while disabling problem via settings',
            err,
            cmdErrors.code.disableProblemSetting
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CODE.FIX_PROBLEM,
      async (fix?: AutoFixProblem) => {
        try {
          if (!fix) {
            return false;
          }

          LogCommandInfo('Auto-fix problem for code action');

          // debug log to show document edits
          IDL_LOGGER.log({
            log: IDL_COMMAND_LOG,
            content: ['Document edits for fix', fix],
            type: 'debug',
          });

          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.CODE.FIX_PROBLEM,
          });

          // check for notebook fixes
          const needsNb =
            fix.filter((item) => item.cell !== undefined).length > 0;

          /** Init active text document */
          let doc: vscode.TextDocument;
          if (needsNb) {
            const nb = GetActiveIDLNotebookWindow();
            if (nb === undefined) {
              return false;
            }
            doc = nb.getCells()[fix[0].cell]?.document;
          } else {
            doc = GetActivePROCodeWindow();
          }

          /** Return if nothing */
          if (doc === undefined) {
            return false;
          }

          /** Get editor */
          const editor = vscode.window.activeTextEditor;

          // edit by replacing the file's contents
          await editor.edit((editBuilder) => {
            for (let i = 0; i < fix.length; i++) {
              editBuilder.replace(
                new vscode.Range(
                  new vscode.Position(fix[i].line, 0),
                  new vscode.Position(fix[i].line, Number.POSITIVE_INFINITY)
                ),
                fix[i].text
              );
            }
          });

          return true;
        } catch (err) {
          LogCommandError(
            'Error while disabling problem via settings',
            err,
            cmdErrors.code.fixProblem
          );
          return false;
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
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CODE.FORMAT_WORKSPACE,
      async (): Promise<boolean> => {
        try {
          LogCommandInfo('Format workspace');

          /**
           * Get workspace folders
           */
          const folders = vscode.workspace.workspaceFolders;

          // make sure we have workspace folders
          if (folders === undefined) {
            vscode.window.showInformationMessage(
              IDL_TRANSLATION.commands.notifications.initConfig.noWorkspaceOpen
            );
            return false;
          }
          // filter out folders that have existing idl.json
          const checkFolders = folders.map((folder) =>
            CleanPath(folder.uri.fsPath)
          );

          // target is what we return
          const res = await vscode.window.showQuickPick(
            checkFolders.map((folder) => {
              return {
                label: basename(folder),
                description: folder,
                target: folder, // return value
              };
            }),
            {
              title:
                IDL_TRANSLATION.commands.notifications.formatWorkspace
                  .pickWorkspace,
              canPickMany: false,
            }
          );

          // make sure we have a folder
          if (res !== undefined) {
            VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
              idl_command: IDL_COMMANDS.CODE.FORMAT_WORKSPACE,
            });

            // format and get response
            const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
              LANGUAGE_SERVER_MESSAGE_LOOKUP.FORMAT_WORKSPACE,
              { folders: [res.target] }
            );

            // if we have failures alert user
            if (resp.failures.length > 0) {
              IDL_LOGGER.log({
                type: 'warn',
                content: [
                  IDL_TRANSLATION.commands.notifications.formatWorkspace
                    .notAllFilesFormatted,
                  resp.failures,
                ],
                alert:
                  IDL_TRANSLATION.commands.notifications.formatWorkspace
                    .notAllFilesFormatted,
              });
            }
          }
        } catch (err) {
          LogCommandError(
            'Error while executing command to format files in workspace',
            err,
            cmdErrors.code.formatWorkspace
          );
        }
      }
    )
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
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.CODE.MIGRATE_TO_DL30_API,
      async () => {
        try {
          LogCommandInfo('Migrate to DL 3.0 API');

          // check for PRO file
          const doc = GetActivePROCodeWindow();

          // make sure we have a file
          if (doc !== undefined) {
            VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
              idl_command: IDL_COMMANDS.CODE.MIGRATE_TO_DL30_API,
            });

            const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
              LANGUAGE_SERVER_MESSAGE_LOOKUP.MIGRATE_CODE,
              {
                uri: doc.uri.toString(),
                migrationType: MIGRATION_TYPE_LOOKUP.ENVI_DL_30,
              }
            );

            // make sure we have a response
            if (resp.text) {
              await ReplaceDocumentContent(doc, resp.text);
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } catch (err) {
          LogCommandError(
            'Error while migrating to DL 3.0 API',
            err,
            cmdErrors.code.migrateToDL30API
          );
          return false;
        }
      }
    )
  );
}
