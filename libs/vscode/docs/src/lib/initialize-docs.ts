import { ExtensionContext } from 'vscode';

import { RegisterDocsCommands } from './register-docs-commands';

/**
 * Initializes our docs views/commands
 */
export function InitializeDocs(ctx: ExtensionContext) {
  // register commands
  RegisterDocsCommands(ctx);
}
