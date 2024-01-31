import { EXTENSION_DOCS_URL, IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
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
    vscode.commands.registerCommand(
      IDL_COMMANDS.DOCS.OPEN,
      async (path: string) => {
        try {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.DOCS.OPEN,
          });

          /**
           * Get the URL we want to open
           */
          const url = IDL_EXTENSION_CONFIG.documentation.useOnline
            ? EXTENSION_DOCS_URL
            : `http://localhost:${IDL_EXTENSION_CONFIG.documentation.localPort}`;

          vscode.commands.executeCommand(
            'vscode.open',
            vscode.Uri.parse(`${url}${path || ''}`)
          );

          return true;
        } catch (err) {
          LogCommandError('Error while opening docs', err, cmdErrors.docs.open);
          return false;
        }
      }
    )
  );
}
