import {
  FindFiles,
  GetExtensionPath,
  USER_COPILOT_FOLDER,
  USER_COPILOT_INSTRUCTIONS_FOLDER,
  USER_COPILOT_PROMPTS_FOLDER,
} from '@idl/idl/files';
import { basename, join } from 'path';
import * as vscode from 'vscode';

import { MoveAndUpdateCopilotFile } from './move-and-update-copilot-file';

/**
 * Registers prompts and instructions files that we provide as
 * part of the extension with GitHub Copilot's configuration
 */
export async function RegisterGitHubCopilotFilesFromExtension(
  type: 'instructions' | 'prompts'
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
    if (existing[i].startsWith(USER_COPILOT_FOLDER)) {
      states[existing[i]] = filesLocations[existing[i]];
      delete filesLocations[existing[i]];
    }
  }

  /** Find prompt files that we should automatically register */
  const files = await FindFiles(dir, fileExtensions);

  // move all files and register
  for (let i = 0; i < files.length; i++) {
    // get path of destination file
    const newPath = join(destinationDir, basename(files[i]));

    // migrate the file
    MoveAndUpdateCopilotFile(files[i], destinationDir);

    // track new location
    filesLocations[newPath] = newPath in states ? states[newPath] : true;
  }

  // Update the configuration globally
  await config.update(
    settingKey,
    filesLocations,
    vscode.ConfigurationTarget.Global
  );
}
