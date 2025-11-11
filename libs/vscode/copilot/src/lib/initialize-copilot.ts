import { IDL_LOGGER } from '@idl/vscode/logger';
import { ExtensionContext } from 'vscode';

import { RegisterCopilotCommands } from './commands/register-copilot-commands';

/**
 * Initializes GitHub Copilot integration
 */
export function InitializeCopilot(ctx: ExtensionContext) {
  IDL_LOGGER.log({
    content: 'Initializing GitHub Copilot integration',
  });

  RegisterCopilotCommands(ctx);
}
