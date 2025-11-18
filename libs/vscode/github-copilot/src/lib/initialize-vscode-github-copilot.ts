import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { RegisterPromptFiles } from './helpers/register-prompts';

/**
 * Initializes our GitHub Copilot VSCode integration
 */
export async function InitializeVSCodeGitHubCopilot(
  ctx: vscode.ExtensionContext
) {
  IDL_LOGGER.log({
    log: IDL_COPILOT_VSCODE_LOG,
    type: 'info',
    content: 'Initiailizing GitHub Copilot configuration',
  });

  try {
    // auto discover and add prompts files to VSCode
    await RegisterPromptFiles();
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_COPILOT_VSCODE_LOG,
      type: 'error',
      content: ['Problem while initializing GitHub Copilot configuration', err],
    });
  }
}
