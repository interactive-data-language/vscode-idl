import { EXAMPLE_NOTEBOOKS, GetExtensionPath } from '@idl/idl/files';
import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/logger';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { cp } from 'fs/promises';
import { join } from 'path';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

// get the command errors from IDL translation
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle terminal interaction
 */
export function RegisterIDLTutorialsCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering IDLTutorials commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
      async (path?: string) => {
        try {
          if (!path) {
            return;
          }
          // make folder if it doesnt exist
          if (!existsSync(EXAMPLE_NOTEBOOKS)) {
            mkdirSync(EXAMPLE_NOTEBOOKS, { recursive: true });
          }

          // get destination path
          const exampleUri = join(EXAMPLE_NOTEBOOKS, path);

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
            cmdErrors.idlTutorials.openIDLTutorial
          );
          return false;
        }
      }
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.TUTORIALS.RESET_TUTORIALS,
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
            'Error while resetting tutorials',
            err,
            cmdErrors.idlTutorials.resetTutorials
          );
          return false;
        }
      }
    )
  );
}
