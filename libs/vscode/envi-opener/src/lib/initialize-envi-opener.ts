import { IDL_LOGGER } from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { ENVIOpenerProvider } from './envi-opener.class';

/**
 * Initializes the IDL terminal interaction
 */
export function InitializeENVIOpener(ctx: ExtensionContext) {
  IDL_LOGGER.log({ content: 'Registering ENVI opener' });

  // create our ENVI opener
  const provider = new ENVIOpenerProvider();

  // register and add to extension context
  ctx.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      ENVIOpenerProvider.viewType,
      provider
    )
  );
}
