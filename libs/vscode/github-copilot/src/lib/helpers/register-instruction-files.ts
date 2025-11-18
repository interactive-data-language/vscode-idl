import { FindFiles, GetExtensionPath } from '@idl/idl/files';
import { existsSync } from 'fs';
import * as vscode from 'vscode';

/**
 * Initializes our GitHub Copilot VSCode integration
 */
export async function RegisterInstructionsFiles() {
  // Get the configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');

  /**
   * Get prompt files
   *
   * Use spread operator to clone so that we can use it
   */
  const instructionsFiles = {
    ...(config.get<Record<string, boolean>>('instructionsFilesLocations') ||
      {}),
  };

  /** Get the GitHub Copilot folder */
  const copilotDir = GetExtensionPath('extension/github-copilot');

  /** Get folder with our prompts */
  const dir = GetExtensionPath('extension/github-copilot/instructions');

  // remove existing in case we added some that are now gone
  const existing = Object.keys(instructionsFiles);

  // remove any existing prompts that are in our prompts folder
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].startsWith(copilotDir)) {
      delete instructionsFiles[existing[i]];
    }
  }

  if (existsSync(dir)) {
    /** Find prompt files that we should automatically register */
    const files = await FindFiles(dir, `**/*.prompt.md`);

    // register al prompts
    for (let i = 0; i < files.length; i++) {
      instructionsFiles[files[i]] = true;
    }
  }

  // Update the configuration globally
  await config.update(
    'instructionsFilesLocations',
    instructionsFiles,
    vscode.ConfigurationTarget.Global
  );
}
