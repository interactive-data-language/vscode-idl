import { LANGUAGE_NAME } from '@idl/shared';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { RegisterDebugCommands } from './commands/register-debug-commands';
import { IDLDebugAdapter } from './idl-debug-adapter.class';
import { ServerIDLDebugAdapterFactory } from './idl-debug-adapter-factory.class';
import { IDLDebugConfigurationProvider } from './idl-debug-configuration';
import { IDLDebugStatusBar } from './idl-debug-status-bar';
import { IInitializeDebuggerResult } from './initialize-debugger.interface';

/**
 * The debug adapter that manages interacting with our session of IDL
 */
export let IDL_DEBUG_ADAPTER: IDLDebugAdapter;

/**
 * Allows us to interact with the IDL status bar
 */
export let IDL_STATUS_BAR: IDLDebugStatusBar;

/**
 * Initializes everything to allow for a debug session of IDL
 */
export function InitializeDebugger(
  ctx: vscode.ExtensionContext
): IInitializeDebuggerResult {
  // register provider for debugging
  IDL_LOGGER.log({
    content: 'Registering debug configuration provider',
  });
  const provider = new IDLDebugConfigurationProvider();
  ctx.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(LANGUAGE_NAME, provider)
  );

  IDL_LOGGER.log({
    content: 'Starting IDL debug server (not IDL)',
  });
  const factory = new ServerIDLDebugAdapterFactory();
  ctx.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(LANGUAGE_NAME, factory)
  );
  if ('dispose' in factory) {
    ctx.subscriptions.push(factory);
  }

  // save our debug adapter
  IDL_DEBUG_ADAPTER = factory.session;

  // create our status bar item
  IDL_STATUS_BAR = new IDLDebugStatusBar();

  // register our commands for debugging
  RegisterDebugCommands(ctx);

  return {
    adapter: IDL_DEBUG_ADAPTER,
    statusBar: IDL_STATUS_BAR,
  };
}
