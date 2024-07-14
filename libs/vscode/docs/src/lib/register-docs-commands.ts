import {
  IDL_COMMANDS,
  ResolveExtensionDocsURL,
  ResolveProductDocsURL,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_LOGGER, LogCommandError } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { existsSync } from 'fs';
import { basename, dirname } from 'path';
import { pathToFileURL } from 'url';
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
          const url = ResolveExtensionDocsURL('', IDL_EXTENSION_CONFIG);

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

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      IDL_COMMANDS.DOCS.OPEN_LINK,
      async (open: { link: string }) => {
        if (!open) {
          return false;
        }
        try {
          /**
           * Flags if we try to open help locally or not.
           *
           * Last flag is "false" because this does not work
           */
          const localHelp =
            IDL_EXTENSION_CONFIG.directory !== '' &&
            existsSync(IDL_EXTENSION_CONFIG.IDL.directory) &&
            !IDL_EXTENSION_CONFIG.documentation.useOnline &&
            false;

          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: IDL_COMMANDS.DOCS.OPEN_LINK,
          });

          /** Get URL from markdown */
          const back = open.link;

          /** fully-qualified link we will open */
          let newLink = '';

          // check if we have IDL installed and configured
          if (localHelp) {
            // get the base IDL install folder folder (i.e. C:\Program Files\Harris\ENVI56\IDL88)
            const idlBase = dirname(
              dirname(IDL_EXTENSION_CONFIG.IDL.directory)
            );

            // get the relative filepath without our placeholder
            const relative = dirname(back).replace('IDL_DOCS/../', '');

            // get the fully-qualified docs folder
            const localFolder = `${idlBase}/help/online_help/${relative}`;

            // get actual URL within the file - this is not encoded when built
            // in apps\idl-docs-parser\src\helpers\replace-links.ts
            const localFile = decodeURI(basename(back.split('#')[0]));

            // get our URI
            const uri = `${localFolder}/${localFile}`;

            // make sure it exists, otherwise default to the web-hosted
            // could be that we dont have the content installed we are trying
            // to reference
            if (existsSync(uri)) {
              newLink =
                pathToFileURL(`${idlBase}/help/online_help`).toString() +
                `/help.htm#../${encodeURI(relative)}/${encodeURI(
                  basename(back)
                )}`;
            } else {
              newLink = ResolveProductDocsURL(back);
            }
          } else {
            newLink = ResolveProductDocsURL(back);
          }

          /**
           * Does not open HTML files correctly
           */
          // vscode.commands.executeCommand(
          //   'vscode.open',
          //   vscode.Uri.parse(newLink)
          // );
          vscode.env.openExternal(vscode.Uri.parse(newLink));

          return true;
        } catch (err) {
          LogCommandError('Error while opening link', err, cmdErrors.docs.open);
          return false;
        }
      }
    )
  );
}
