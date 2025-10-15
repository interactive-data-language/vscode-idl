import { IDL_LOGGER } from '@idl/vscode/logger';
import { ExtensionContext } from 'vscode';

import { RegisterIDLTutorialsCommands } from './commands/register-idl-tutorials-commands';

/**
 * Initializes our tree views
 */
export function InitializeIDLTutorials(ctx: ExtensionContext) {
  IDL_LOGGER.log({
    content: 'initializing IDL tutorials',
  });

  RegisterIDLTutorialsCommands(ctx);
}
