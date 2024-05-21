import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import {
  ConvertDocsToNotebook,
  DOCS_NOTEBOOK_FOLDER,
  EXAMPLE_NOTEBOOKS,
} from '@idl/notebooks/shared';
import {
  CleanPath,
  GetExtensionPath,
  IDL_COMMANDS,
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_EXTENSION,
  IDL_NOTEBOOK_LANGUAGE_NAME,
  Sleep,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { INotebookToProCodeOptions } from '@idl/types/notebooks';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  LANGUAGE_SERVER_MESSENGER,
  LogCommandError,
  LogCommandInfo,
} from '@idl/vscode/client';
import { BasicQuestionAsker } from '@idl/vscode/config';
import {
  IRetrieveDocsPayload,
  LANGUAGE_SERVER_MESSAGE_LOOKUP,
} from '@idl/vscode/events/messages';
import {
  GetActiveIDLNotebookWindow,
  OpenFileInVSCode,
  OpenNotebookInVSCode,
  VSCODE_COMMANDS,
  VSCodeTelemetryLogger,
} from '@idl/vscode/shared';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { cp } from 'fs/promises';
import { join } from 'path';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { NotebookToMarkdown } from '../conversion/notebook-to-markdown';
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

        LogCommandInfo('Resetting IDL (notebook)');

        /** Get notebooks */
        const nb = GetActiveIDLNotebookWindow(true);

        // return if no notebook
        if (nb === undefined) {
          return;
        }

        // make sure we have launched IDL
        if (IDL_NOTEBOOK_CONTROLLER.isStarted(nb)) {
          await IDL_NOTEBOOK_CONTROLLER.stop(nb);
          await Sleep(100);
          await IDL_NOTEBOOK_CONTROLLER.launchIDL(
            nb,
            IDL_TRANSLATION.notebooks.notifications.resettingIDL
          );
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
          cmdErrors.notebooks.resetIDLKernel
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

        LogCommandInfo('Stopping IDL (notebook)');

        /** Get notebooks */
        const nb = GetActiveIDLNotebookWindow(true);

        // return if no notebook
        if (nb === undefined) {
          return;
        }

        // check if launched
        if (IDL_NOTEBOOK_CONTROLLER.isStarted(nb)) {
          // trigger reset and create promise
          const prom = IDL_NOTEBOOK_CONTROLLER.stop(nb);

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
          cmdErrors.notebooks.stopIDLKernel
        );
        return false;
      }
    })
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.STOP_ALL_KERNELS,
      async () => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.NOTEBOOKS.STOP_ALL_KERNELS,
          });

          LogCommandInfo('Stopping all IDL Notebook Kernels');

          /** Stop all notebook sessions */
          await IDL_NOTEBOOK_CONTROLLER.stopAll();

          return true;
        } catch (err) {
          LogCommandError(
            'Error stopping notebook',
            err,
            cmdErrors.notebooks.stopIDLKernel
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.HELP_AS_NOTEBOOK,
      async (arg: IRetrieveDocsPayload) => {
        try {
          // return if no arg
          if (arg === undefined) {
            return;
          }

          // make folder if it doesnt exist
          if (!existsSync(DOCS_NOTEBOOK_FOLDER)) {
            mkdirSync(DOCS_NOTEBOOK_FOLDER, { recursive: true });
          }

          const file = join(
            DOCS_NOTEBOOK_FOLDER,
            `docs.${arg.name.toLowerCase().replace(/!|:/gim, '_')}.${
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

          const converted = await ConvertDocsToNotebook(arg, resp.docs);

          // check if we have no examples
          if (converted === undefined) {
            vscode.window.showInformationMessage(
              IDL_TRANSLATION.notebooks.notifications.noExamplesFoundInDocs
            );
            return false;
          }

          // make notebook and save to disk
          writeFileSync(file, await ConvertDocsToNotebook(arg, resp.docs));

          // open the notebook in vscode
          await OpenNotebookInVSCode(file, true, true);

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

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.NEW_NOTEBOOK,
      async (dontSave?: boolean) => {
        try {
          const doc = await vscode.workspace.openNotebookDocument(
            IDL_NOTEBOOK_LANGUAGE_NAME
          );

          await vscode.window.showNotebookDocument(doc);

          // prompt user to save
          if (!dontSave) {
            await vscode.commands.executeCommand(VSCODE_COMMANDS.SAVE_EDITOR);
          }

          // return as though we succeeded
          return true;
        } catch (err) {
          LogCommandError(
            'Error creating a new IDL Notebook',
            err,
            cmdErrors.notebooks.newNotebook
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.OPEN_ENVI_EXAMPLE,
      async () => {
        try {
          // make folder if it doesnt exist
          if (!existsSync(EXAMPLE_NOTEBOOKS)) {
            mkdirSync(EXAMPLE_NOTEBOOKS, { recursive: true });
          }

          // get destination path
          const exampleUri = join(EXAMPLE_NOTEBOOKS, 'hello-world-envi.idlnb');

          // if it doesnt exist, copy it
          if (!existsSync(exampleUri)) {
            await cp(
              GetExtensionPath('extension/example-notebooks'),
              EXAMPLE_NOTEBOOKS,
              { recursive: true }
            );
          }

          // open the notebook in vscode
          await OpenNotebookInVSCode(exampleUri, true, false);

          // return as though we succeeded
          return true;
        } catch (err) {
          LogCommandError(
            'Error opening IDL example notebook',
            err,
            cmdErrors.notebooks.openIDLExample
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.OPEN_IDL_EXAMPLE,
      async () => {
        try {
          // make folder if it doesnt exist
          if (!existsSync(EXAMPLE_NOTEBOOKS)) {
            mkdirSync(EXAMPLE_NOTEBOOKS, { recursive: true });
          }

          // get destination path
          const exampleUri = join(EXAMPLE_NOTEBOOKS, 'hello-world-idl.idlnb');

          // if it doesnt exist, copy it
          if (!existsSync(exampleUri)) {
            await cp(
              GetExtensionPath('extension/example-notebooks'),
              EXAMPLE_NOTEBOOKS,
              { recursive: true }
            );
          }

          // open the notebook in vscode
          await OpenNotebookInVSCode(exampleUri, true, false);

          // return as though we succeeded
          return true;
        } catch (err) {
          LogCommandError(
            'Error opening IDL example notebook',
            err,
            cmdErrors.notebooks.openIDLExample
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.NOTEBOOK_TO_PRO_CODE,
      async (options?: Partial<INotebookToProCodeOptions>) => {
        try {
          // get open notebook
          const notebook = GetActiveIDLNotebookWindow();

          // no notebook, indicate that we didnt run
          if (!notebook) {
            return false;
          }

          /**
           * Options object we pass to the API
           */
          const useOptions: Partial<INotebookToProCodeOptions> = {};

          /**
           * If we didnt pass in options, ask the user for some information
           */
          if (!options) {
            const includeAll = await vscode.window.showInformationMessage(
              IDL_TRANSLATION.notebooks.notifications.includeAllCells,
              ...[
                { title: IDL_TRANSLATION.notifications.yes },
                { title: IDL_TRANSLATION.notifications.no },
              ]
            );

            if (includeAll === undefined) {
              return;
            }

            // update flag to include everything
            useOptions.includeAllCells =
              includeAll.title === IDL_TRANSLATION.notifications.yes
                ? true
                : false;
          } else {
            // update the options we use with what was passed in
            Object.assign(useOptions, options);
          }

          /**
           * Track if its a file or not
           */
          let isFile = true;
          try {
            await vscode.workspace.fs.stat(notebook.uri);
          } catch (err) {
            isFile = false;
          }

          // if we couldnt get stats on the file, it hasnt been saved
          if (!isFile) {
            vscode.window.showWarningMessage(
              IDL_TRANSLATION.notebooks.notifications.saveNotebookFirst
            );
            return false;
          }

          const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
            LANGUAGE_SERVER_MESSAGE_LOOKUP.NOTEBOOK_TO_PRO_CODE,
            {
              uri: notebook.uri.toString(),
              options: useOptions,
            }
          );

          // make sure we didnt have an error
          if (!resp) {
            return false;
          }

          // open a new document with the PRO code
          const doc = await vscode.workspace.openTextDocument({
            content: resp.code,
            language: IDL_LANGUAGE_NAME,
          });

          // show it
          await vscode.window.showTextDocument(doc);

          return true;
        } catch (err) {
          LogCommandError(
            'Error converting notebook to PRO code',
            err,
            cmdErrors.notebooks.notebookToProCode
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.RESET_NOTEBOOK_EXAMPLES,
      async () => {
        try {
          // make folder if it doesnt exist
          if (existsSync(EXAMPLE_NOTEBOOKS)) {
            rmSync(EXAMPLE_NOTEBOOKS, { recursive: true });
          }

          // make folder if it doesnt exist
          if (!existsSync(EXAMPLE_NOTEBOOKS)) {
            mkdirSync(EXAMPLE_NOTEBOOKS, { recursive: true });
          }

          await cp(
            GetExtensionPath('extension/example-notebooks'),
            EXAMPLE_NOTEBOOKS,
            { recursive: true }
          );

          // return as though we succeeded
          return true;
        } catch (err) {
          LogCommandError(
            'Error while resetting example notebooks',
            err,
            cmdErrors.notebooks.resetNotebookExamples
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.NOTEBOOKS.CONVERT_TO_PDF,
      async () => {
        try {
          // get our dependency
          const dep = vscode.extensions.getExtension('yzane.markdown-pdf');

          // return if not installed
          if (!dep) {
            let shouldReturn = true;

            // ask if we can isntall
            await BasicQuestionAsker(
              IDL_TRANSLATION.notebooks.notifications.needMarkdownPDF,
              () => {
                shouldReturn = false;
              }
            );

            // return if didnt confirm
            if (shouldReturn) {
              return;
            }

            /**
             * Install required extension
             */
            await vscode.commands.executeCommand(
              'workbench.extensions.installExtension',
              'yzane.markdown-pdf'
            );

            vscode.window.showWarningMessage(
              IDL_TRANSLATION.notebooks.notifications.markdownPDFWaitForInstall
            );
            return false;
          }

          // get open notebook
          const notebook = GetActiveIDLNotebookWindow();

          // no notebook, indicate that we didnt run
          if (!notebook) {
            return false;
          }

          /**
           * Track if its a file or not
           */
          let isFile = true;
          try {
            await vscode.workspace.fs.stat(notebook.uri);
          } catch (err) {
            isFile = false;
          }

          // if we couldnt get stats on the file, it hasnt been saved
          if (!isFile) {
            vscode.window.showWarningMessage(
              IDL_TRANSLATION.notebooks.notifications.saveNotebookFirst
            );
            return false;
          }

          /**
           * Convert to markdown
           */
          const md = await NotebookToMarkdown(notebook);

          /**
           * Get URI for NB conversion
           */
          const mdUri = CleanPath(notebook.uri.fsPath).replace(
            IDL_NOTEBOOK_EXTENSION,
            '.md'
          );
          writeFileSync(mdUri, md.join('\n'));

          const doc = await OpenFileInVSCode(mdUri, true);

          // short pause to let extension start
          await Sleep(200);

          /**
           * Convert to PDF
           */
          const prom = vscode.commands.executeCommand(
            'extension.markdown-pdf.pdf'
          );

          // close markdown file
          await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

          // wait for conversion to finish
          await prom;

          /**
           * Get URI for NB conversion
           */
          const pdfUri = mdUri.replace('.md', '.pdf');

          // show PDF in explorer
          await vscode.commands.executeCommand(
            'revealFileInOS',
            vscode.Uri.file(pdfUri)
          );

          return true;
        } catch (err) {
          LogCommandError(
            'Error while converting notebook to pdf',
            err,
            cmdErrors.notebooks.convertToPDF
          );
          return false;
        }
      }
    )
  );
}
