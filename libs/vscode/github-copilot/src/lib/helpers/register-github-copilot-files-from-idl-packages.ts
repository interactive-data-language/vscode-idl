import {
  FindFiles,
  IDL_PACKAGE_DIR,
  IDL_PACKAGE_DIR_HOME_RELATIVE,
} from '@idl/idl/files';
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
    if (
      // keep check for the glob pattern only for delete. This is to move us over from a old pattern to a new one.
      existing[i].startsWith(IDL_PACKAGE_DIR) ||
      existing[i].startsWith(IDL_PACKAGE_DIR_HOME_RELATIVE)
    ) {
      states[existing[i]] = filesLocations[existing[i]];
      delete filesLocations[existing[i]];
    }
  }

  /** Get the subdirectory for this type */
  const subDirForFind = `${IDL_PACKAGE_DIR}/vscode/github-copilot/${
    type === 'instructions' ? 'instructions' : 'prompts'
  }`;

  /** Find prompt files that we should automatically register */
  // Find files needs a absolute path.
  const files = await FindFiles(subDirForFind, fileExtensions);

  // Register directory if files exist
  // settings need a relative.
  if (files.length > 0) {
    const subDirForSettings = `${IDL_PACKAGE_DIR_HOME_RELATIVE}/vscode/github-copilot/${
      type === 'instructions' ? 'instructions' : 'prompts'
    }`;

    filesLocations[subDirForSettings] =
      subDirForSettings in states ? states[subDirForSettings] : true;
  }

  // Update the configuration globally
  await config.update(
    settingKey,
    filesLocations,
    vscode.ConfigurationTarget.Global
  );
}
