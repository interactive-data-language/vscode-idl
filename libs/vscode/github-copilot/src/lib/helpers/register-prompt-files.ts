import { FindFiles, GetExtensionPath } from '@idl/idl/files';
import * as vscode from 'vscode';

/**
 * Initializes our GitHub Copilot VSCode integration
 */
export async function RegisterPromptFiles() {
  // Get the configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');

  /**
   * Get prompt files
   *
   * Use spread operator to clone so that we can use it
   */
  const promptFilesLocations = {
    ...(config.get<Record<string, boolean>>('promptFilesLocations') || {}),
  };

  /** Get the GitHub Copilot folder */
  const copilotDir = GetExtensionPath('extension/github-copilot');

  /** Get folder with our prompts */
  const dir = GetExtensionPath('extension/github-copilot/prompts');

  // remove existing in case we added some that are now gone
  const existing = Object.keys(promptFilesLocations);

  // get existing flags
  const states: { [key: string]: boolean } = {};

  // remove any existing prompts that are in our prompts folder
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].startsWith(copilotDir)) {
      states[existing[i]] = promptFilesLocations[existing[i]];
      delete promptFilesLocations[existing[i]];
    }
  }

  /** Find prompt files that we should automatically register */
  const files = await FindFiles(dir, `**/*.prompt.md`);

  // register al prompts
  for (let i = 0; i < files.length; i++) {
    promptFilesLocations[files[i]] =
      files[i] in states ? states[files[i]] : true;
  }

  // Update the configuration globally
  await config.update(
    'promptFilesLocations',
    promptFilesLocations,
    vscode.ConfigurationTarget.Global
  );
}
