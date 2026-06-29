import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { RegisterCopilotCommands } from './commands/register-copilot-commands';
import { InstructionsSync } from './helpers/instructions-sync.class';
import { RegisterGitHubCopilotFilesFromExtension } from './helpers/register-github-copilot-files-from-extension';
import { RegisterGitHubCopilotFilesFromIDLPackages } from './helpers/register-github-copilot-files-from-idl-packages';
import { RegisterGitHubCopilotFilesFromUser } from './helpers/register-github-copilot-files-from-user';

/**
 * Initializes our GitHub Copilot VSCode integration
 */
export async function InitializeVSCodeGitHubCopilot(
  ctx: vscode.ExtensionContext,
) {
  IDL_LOGGER.log({
    log: IDL_COPILOT_VSCODE_LOG,
    type: 'info',
    content: 'Initializing GitHub Copilot configuration',
  });

  // register copilot instructions and resources.
  RegisterCopilotCommands(ctx);

  /**
   * Attempt to add instructions
   */
  try {
    await RegisterGitHubCopilotFilesFromExtension('instructions');
    await RegisterGitHubCopilotFilesFromIDLPackages('instructions');
    await RegisterGitHubCopilotFilesFromUser('instructions');
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
   * Set up bidirectional sync between instructions files and settings
   */
  const idlSync = new InstructionsSync({
    configNamespace: 'idl',
    instructionsFile: 'idl.instructions.md',
    settingKey: 'copilot.customInstructions',
  });

  const enviSync = new InstructionsSync({
    configNamespace: 'idl',
    instructionsFile: 'envi.instructions.md',
    settingKey: 'copilot.customInstructionsENVI',
  });

  // fire once for each.
  await idlSync.syncFromSettingToFile();
  await enviSync.syncFromSettingToFile();

  // set up our watchers. These keep the files and settings in lockstep.
  ctx.subscriptions.push(idlSync.watchFileChanges());
  ctx.subscriptions.push(idlSync.watchSettingChanges());
  ctx.subscriptions.push(enviSync.watchFileChanges());
  ctx.subscriptions.push(enviSync.watchSettingChanges());

  /**
   * Attempt to add prompt files to VSCode
   */
  try {
    await RegisterGitHubCopilotFilesFromExtension('prompts');
    await RegisterGitHubCopilotFilesFromIDLPackages('prompts');
    await RegisterGitHubCopilotFilesFromUser('prompts');
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_COPILOT_VSCODE_LOG,
      type: 'error',
      content: ['Problem while initializing GitHub Copilot prompt files', err],
    });
  }
}
