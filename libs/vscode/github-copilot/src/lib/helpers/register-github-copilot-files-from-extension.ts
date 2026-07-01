import {
  FindFiles,
  GetExtensionPath,
  OLD_USER_AGENTS_FOLDER,
  USER_AGENT_INSTRUCTIONS_FOLDER,
  USER_AGENT_PROMPTS_FOLDER,
  USER_AGENTS_FOLDER,
} from '@idl/idl/files';
import { existsSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
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
      ? 'extension/agents/instructions'
      : 'extension/agents/prompts';

  /** Get the file extension we search for */
  const fileExtensions =
    type === 'instructions' ? '**/*.instructions.md' : '**/*.prompt.md';

  /** Folder that our instructions should go into */
  const destinationDir =
    type === 'instructions'
      ? USER_AGENT_INSTRUCTIONS_FOLDER
      : USER_AGENT_PROMPTS_FOLDER;

  /**
   * Clean up existing files
   *
   * Don't just nuke the folder - it get's locked sometimes by VSCode when prompts
   * are registered (or at least it looks like that)
   */
  if (existsSync(destinationDir)) {
    const existingFiles = readdirSync(destinationDir).map((file) =>
      join(destinationDir, file),
    );
    for (let i = 0; i < existingFiles.length; i++) {
      unlinkSync(existingFiles[i]);
    }
  }

  // relative path for destination
  const destinationRelative = HomeRelativePath(destinationDir);

  /** Get old relative path for agents content */
  const oldRelative = HomeRelativePath(OLD_USER_AGENTS_FOLDER);

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
    // check if old location to clean up setting
    if (existing[i].startsWith(oldRelative)) {
      delete filesLocations[existing[i]];
      continue;
    }

    if (
      // keep check for the glob pattern only for delete. This is to move us over from a old pattern to a new one.
      existing[i].startsWith(USER_AGENTS_FOLDER) ||
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
