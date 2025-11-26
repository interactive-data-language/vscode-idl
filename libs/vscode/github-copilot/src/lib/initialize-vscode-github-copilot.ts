import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { RegisterCopilotCommands } from './commands/register-copilot-commands';
import { RegisterGitHubCopilotFiles } from './helpers/register-github-copilot-files';

/**
 * Initializes our GitHub Copilot VSCode integration
 */
export async function InitializeVSCodeGitHubCopilot(
  ctx: vscode.ExtensionContext
) {
  IDL_LOGGER.log({
    log: IDL_COPILOT_VSCODE_LOG,
    type: 'info',
    content: 'Initializing GitHub Copilot configuration',
  });

  // register copilot instructions and resources.
  RegisterCopilotCommands(ctx);

  /**
   * Attempt to add isntructions
   */
  try {
    await RegisterGitHubCopilotFiles('instructions');
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_COPILOT_VSCODE_LOG,
      type: 'error',
      content: [
        'Problem while initializing GitHub Copilot instruction files',
        err,
      ],
    });
  }

  /**
   * Attempt to add prompt files to VSCode
   */
  try {
    await RegisterGitHubCopilotFiles('prompts');
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_COPILOT_VSCODE_LOG,
      type: 'error',
      content: ['Problem while initializing GitHub Copilot prompt files', err],
    });
  }
}
