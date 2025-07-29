import { IDL_LOGGER } from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';

import { RegisterIDLTutorialsCommands } from './commands/register-idl-tutorials-commands';

/**
 * Initializes our tree views
 */
export function InitializeIDLTutorials(ctx: ExtensionContext) {
  IDL_LOGGER.log({
    content: 'Registering notebook serializer and controller',
  });

  RegisterIDLTutorialsCommands(ctx);
}
