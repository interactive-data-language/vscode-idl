import {
  FindFiles,
  GetExtensionPath,
  USER_AGENT_INSTRUCTIONS_FOLDER,
} from '@idl/idl/files';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { existsSync, unlinkSync } from 'fs';
import { basename, join } from 'path';

import { MoveAndUpdateCopilotFile } from './move-and-update-copilot-file';

/**
 * Copies the instructions files that we provide as part of the extension
 * to the user's GitHub Copilot instructions folder, which Copilot
 * discovers natively
 */
export async function RegisterGitHubCopilotFilesFromExtension() {
  /** Folder that our instructions should go into */
  const destinationDir = USER_AGENT_INSTRUCTIONS_FOLDER;

  /** Get folder with our instructions */
  const dir = GetExtensionPath('resources/agents/instructions');

  /** Find instruction files that we provide */
  const allFiles = await FindFiles(dir, '**/*.instructions.md');

  /**
   * Clean up existing files that we manage
   *
   * Do not remove other files because the folder is shared with the user
   */
  for (let i = 0; i < allFiles.length; i++) {
    const existingFile = join(destinationDir, basename(allFiles[i]));
    if (existsSync(existingFile)) {
      unlinkSync(existingFile);
    }
  }

  let files = allFiles;

  /**
   * Exclude ENVI items from being auto copied/updated
   */
  if (!IDL_EXTENSION_CONFIG.copilot.registerENVIInstructions) {
    files = files.filter((item) => !item.toLowerCase().includes('envi'));
  }

  // Move all files
  for (let i = 0; i < files.length; i++) {
    MoveAndUpdateCopilotFile(files[i], destinationDir);
  }
}
