import { FindFiles, IDL_PACKAGE_DIR } from '@idl/idl/files';
import * as vscode from 'vscode';

/**
 * Registers prompts and instruction files from the IDL Packages folder
 * automatically for GitHub Copilot
 */
export async function RegisterGitHubCopilotFilesFromIDLPackages(
  type: 'instructions' | 'prompts'
) {
  // Get the configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');

  /** Get settings key */
  const settingKey =
    type === 'instructions'
      ? 'instructionsFilesLocations'
      : 'promptFilesLocations';

  /** Get the file extension we search for */
  const fileExtensions =
    type === 'instructions' ? '**/*.instructions.md' : '**/*.prompt.md';

  /**
   * Get prompt files
   *
   * Use spread operator to clone so that we can use it
   */
  const filesLocations = {
    ...(config.get<Record<string, boolean>>(settingKey) || {}),
  };

  // remove existing in case we added some that are now gone
  const existing = Object.keys(filesLocations);

  // get existing flags
  const states: { [key: string]: boolean } = {};

  // remove any existing files from settings in case we deleted/removed prompts
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].startsWith(IDL_PACKAGE_DIR)) {
      states[existing[i]] = filesLocations[existing[i]];
      delete filesLocations[existing[i]];
    }
  }

  /** Find prompt files that we should automatically register */
  const files = await FindFiles(IDL_PACKAGE_DIR, fileExtensions);

  // move all files and register
  for (let i = 0; i < files.length; i++) {
    // track new location
    filesLocations[files[i]] = files[i] in states ? states[files[i]] : true;
  }

  // Update the configuration globally
  await config.update(
    settingKey,
    filesLocations,
    vscode.ConfigurationTarget.Global
  );
}
