import {
  USER_AGENT_PROMPTS_FOLDER,
  USER_AGENTS_FOLDER,
  USER_CUSTOM_AGENT_PROMPTS_FOLDER,
} from '@idl/idl/files';
import * as vscode from 'vscode';

import { HomeRelativePath } from './home-relative-path';

/**
 * Cleans up legacy prompts folders on disk and removes prompt settings
 * from VS Code's chat configuration.
 */
export async function CleanupLegacyPromptSettings(): Promise<void> {
  // Get configuration for chat settings
  const config = vscode.workspace.getConfiguration('chat');
  const promptLocations = {
    ...(config.get<Record<string, boolean>>('promptFilesLocations') || {}),
  };

  const promptKeys = Object.keys(promptLocations);
  if (promptKeys.length === 0) {
    return;
  }

  const promptRelative = HomeRelativePath(USER_AGENT_PROMPTS_FOLDER);
  const customPromptRelative = HomeRelativePath(
    USER_CUSTOM_AGENT_PROMPTS_FOLDER,
  );
  let changed = false;

  for (let i = 0; i < promptKeys.length; i++) {
    const key = promptKeys[i];
    if (
      key.startsWith(USER_AGENTS_FOLDER) ||
      key.startsWith(USER_AGENT_PROMPTS_FOLDER) ||
      key.startsWith(promptRelative) ||
      key.startsWith(USER_CUSTOM_AGENT_PROMPTS_FOLDER) ||
      key.startsWith(customPromptRelative)
    ) {
      delete promptLocations[key];
      changed = true;
    }
  }

  if (changed) {
    await config.update(
      'promptFilesLocations',
      promptLocations,
      vscode.ConfigurationTarget.Global,
    );
  }
}
