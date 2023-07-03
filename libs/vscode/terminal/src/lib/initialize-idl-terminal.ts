import { ExtensionContext } from 'vscode';

import { RegisterTerminalCommands } from './register-terminal-commands';

/**
 * Initializes the IDL terminal interaction
 */
export function InitializeIDLTerminal(ctx: ExtensionContext) {
  RegisterTerminalCommands(ctx);
}
