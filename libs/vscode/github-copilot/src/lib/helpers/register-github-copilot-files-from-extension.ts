import {
  FindFiles,
  GetExtensionPath,
  USER_COPILOT_FOLDER,
  USER_COPILOT_INSTRUCTIONS_FOLDER,
  USER_COPILOT_PROMPTS_FOLDER,
} from '@idl/idl/files';
import { existsSync, rmSync } from 'fs';
import * as vscode from 'vscode';

import { HomeRelativePath } from './home-relative-path';
import { MoveAndUpdateCopilotFile } from './move-and-update-copilot-file';

/**
 * Registers prompts and instructions files that we provide as
 * part of the extension with GitHub Copilot's configuration
 */
export async function RegisterGitHubCopilotFilesFromExtension(
  type: 'instructions' | 'prompts',
) {
  // Get the configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');

  /** Get settings key */
  const settingKey =
    type === 'instructions'
      ? 'instructionsFilesLocations'
      : 'promptFilesLocations';

  /** Get the folder our extensions live in */
  const extensionDir =
    type === 'instructions'
      ? 'extension/github-copilot/instructions'
      : 'extension/github-copilot/prompts';

  /** Get the file extension we search for */
  const fileExtensions =
    type === 'instructions' ? '**/*.instructions.md' : '**/*.prompt.md';

  /** Folder that our instructions should go into */
  const destinationDir =
    type === 'instructions'
      ? USER_COPILOT_INSTRUCTIONS_FOLDER
      : USER_COPILOT_PROMPTS_FOLDER;

  // clean up
  if (existsSync(destinationDir)) {
    rmSync(destinationDir, { recursive: true });
  }

  // relative path for destination
  const destinationRelative = HomeRelativePath(destinationDir);

  /**
   * Get prompt files
   *
   * Use spread operator to clone so that we can use it
   */
  const filesLocations = {
    ...(config.get<Record<string, boolean>>(settingKey) || {}),
  };

  /** Get folder with our prompts */
  const dir = GetExtensionPath(extensionDir);

  // remove existing in case we added some that are now gone
  const existing = Object.keys(filesLocations);

  // get existing flags
  const states: { [key: string]: boolean } = {};

  // remove any existing files from settings in case we deleted/removed prompts
  for (let i = 0; i < existing.length; i++) {
    if (
      // keep check for the glob pattern only for delete. This is to move us over from a old pattern to a new one.
      existing[i].startsWith(USER_COPILOT_FOLDER) ||
      existing[i].startsWith(destinationRelative)
    ) {
      states[existing[i]] = filesLocations[existing[i]];
      delete filesLocations[existing[i]];
    }
  }

  /** Find prompt files that we should automatically register */
  const files = await FindFiles(dir, fileExtensions);

  // Move all files
  // we need a absolute path for operations like copy/move/read/write. But we want to register the home-relative path with copilot settings to be compliant.
  for (let i = 0; i < files.length; i++) {
    MoveAndUpdateCopilotFile(files[i], destinationDir);
  }

  // Use home-relative paths.
  // Register directory if files exist
  if (files.length > 0) {
    // save state
    filesLocations[destinationRelative] =
      destinationRelative in states ? states[destinationRelative] : true;
  }

  // Update the configuration globally
  await config.update(
    settingKey,
    filesLocations,
    vscode.ConfigurationTarget.Global,
  );
}
