import { GetExtensionPath, IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/client';
import { VSCODE_COMMANDS, VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

// get the command errors from IDL translating
const cmdErrors = IDL_TRANSLATION.commands.errors;

/**
 * Adds commands to VSCode to handle opening our embedded docs
 */
export function RegisterDocsCommands(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering docs commands' });

  ctx.subscriptions.push(
    vscode.commands.registerCommand(IDL_COMMANDS.DOCS.OPEN, async () => {
      try {
        VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: IDL_COMMANDS.DOCS.OPEN,
        });

        const uri = vscode.Uri.file(
          GetExtensionPath('extension/docs/README.md')
        );
        await vscode.commands.executeCommand(
          VSCODE_COMMANDS.MARKDOWN_PREVIEW,
          uri
        );
        // const doc = await vscode.workspace.openTextDocument(uri);
        // console.log(
        //   await vscode.commands.executeCommand(
        //     VSCODE_COMMANDS.MARKDOWN_RENDER,
        //     doc
        //   )
        // );
        return true;
      } catch (err) {
        LogCommandError('Error while opening docs', err, cmdErrors.docs.open);
        return false;
      }
    })
  );
}
