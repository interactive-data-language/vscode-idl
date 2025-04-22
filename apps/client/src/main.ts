import { MEASUREMENT } from '@idl/usage-metrics';
import {
  InitializeClient,
  LANGUAGE_SERVER_CLIENT,
  LANGUAGE_SERVER_FAILED_START,
  LANGUAGE_SERVER_MESSENGER,
} from '@idl/vscode/client';
import { InitializeDebugger } from '@idl/vscode/debug';
import { IDL_DECORATIONS_MANAGER } from '@idl/vscode/decorations';
import { InitializeDocs } from '@idl/vscode/docs';
import { InitializeENVIOpener } from '@idl/vscode/envi-opener';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IInitializeType } from '@idl/vscode/initialize-types';
import { InitializeNotebooks } from '@idl/vscode/notebooks/client';
import { InitializeIDLTerminal } from '@idl/vscode/terminal';
import { InitializeTree } from '@idl/vscode/tree-view';
import { InitializeWebView } from '@idl/vscode/webview';
import { ExtensionContext } from 'vscode';

import { environment } from './environments/environment';

MEASUREMENT.ID = environment.measurement;

/**
 * Function that activates our extension
 */
export async function activate(
  ctx: ExtensionContext
): Promise<IInitializeType> {
  // initialize our extension client
  const client = await InitializeClient(ctx);

  // add debugging
  const debug = InitializeDebugger(ctx);

  // listen for MCP tool requests - needs to be done here to avoid circular dependencies
  LANGUAGE_SERVER_MESSENGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
    debug.mcpHandler
  );

  // add everything for IDL terminal
  InitializeIDLTerminal(ctx);

  // add our webview
  const webview = InitializeWebView(ctx);

  // add our ENVI file opener
  InitializeENVIOpener(ctx);

  // add commands for docs
  InitializeDocs(ctx);

  // add notebooks
  const notebooks = InitializeNotebooks(ctx);

  // initialize our tree view
  InitializeTree(ctx, false);

  // return result
  return {
    client,
    debug,
    notebooks,
    webview,
    decorations: IDL_DECORATIONS_MANAGER,
  };
}

/**
 * Manages stopping/deactivating our extension
 */
export function deactivate(): Thenable<void> | undefined {
  if (LANGUAGE_SERVER_FAILED_START) {
    return undefined;
  }
  return LANGUAGE_SERVER_CLIENT.stop();
}
