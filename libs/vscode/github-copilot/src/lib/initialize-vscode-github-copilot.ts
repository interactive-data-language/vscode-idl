import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { RegisterCopilotCommands } from './commands/register-copilot-commands';
import { RegisterInstructionsFiles } from './helpers/register-instruction-files';
import { RegisterPromptFiles } from './helpers/register-prompt-files';

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

  try {
    // auto discover and add prompts files to VSCode
    await RegisterInstructionsFiles();
    await RegisterPromptFiles();
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_COPILOT_VSCODE_LOG,
      type: 'error',
      content: ['Problem while initializing GitHub Copilot configuration', err],
    });
  }
}
