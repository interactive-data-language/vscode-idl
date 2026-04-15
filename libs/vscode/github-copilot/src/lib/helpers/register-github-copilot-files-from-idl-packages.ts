import { IDL_PACKAGE_DIR } from '@idl/idl/files';
import { existsSync } from 'fs';
import * as vscode from 'vscode';

import { HomeRelativePath } from './home-relative-path';

/**
 * Registers prompts and instruction files from the IDL Packages folder
 * automatically for GitHub Copilot
 */
export async function RegisterGitHubCopilotFilesFromIDLPackages(
  type: 'instructions' | 'prompts',
) {
  // Get the configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');

  /** Get settings key */
  const settingKey =
    type === 'instructions'
      ? 'instructionsFilesLocations'
      : 'promptFilesLocations';

  // return if .idl folder doesnt exist
  if (!existsSync(IDL_PACKAGE_DIR)) {
    return;
  }

  // relative path for destination
  const destinationRelative = HomeRelativePath(IDL_PACKAGE_DIR);

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
    if (
      // keep check for the glob pattern only for delete. This is to move us over from a old pattern to a new one.
      existing[i].startsWith(IDL_PACKAGE_DIR) ||
      existing[i].startsWith(destinationRelative)
    ) {
      states[existing[i]] = filesLocations[existing[i]];
      delete filesLocations[existing[i]];
    }
  }

  // set relative path to IDL packages folder to load from
  filesLocations[destinationRelative] =
    destinationRelative in states ? states[destinationRelative] : true;

  // Update the configuration globally
  await config.update(
    settingKey,
    filesLocations,
    vscode.ConfigurationTarget.Global,
  );
}
