import {
  USER_CUSTOM_COPILOT_INSTRUCTIONS_FOLDER,
  USER_CUSTOM_COPILOT_PROMPTS_FOLDER,
} from '@idl/idl/files';
import { existsSync } from 'fs';
import * as vscode from 'vscode';

import { HomeRelativePath } from './home-relative-path';

/**
 * Check if the user has created any custom folders for where their own
 * prompts can be stored and managed
 */
export async function RegisterGitHubCopilotFilesFromUser(
  type: 'instructions' | 'prompts'
) {
  // Get the configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');

  /** Get settings key */
  const settingKey =
    type === 'instructions'
      ? 'instructionsFilesLocations'
      : 'promptFilesLocations';

  /** Folder that user created */
  const customDir =
    type === 'instructions'
      ? USER_CUSTOM_COPILOT_INSTRUCTIONS_FOLDER
      : USER_CUSTOM_COPILOT_PROMPTS_FOLDER;

  // return if doesnt exist
  if (!existsSync(customDir)) {
    return;
  }

  // relative path for destination
  const destinationRelative = HomeRelativePath(customDir);

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
      existing[i].startsWith(customDir) ||
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
    vscode.ConfigurationTarget.Global
  );
}
