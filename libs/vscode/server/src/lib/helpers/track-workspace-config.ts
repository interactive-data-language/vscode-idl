import { LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDLExtensionConfig,
} from '@idl/vscode/extension-config';
import { WorkspaceFolder } from 'vscode-languageserver';
import { URI } from 'vscode-uri';

import { SERVER_CONNECTION } from '../initialize-server';
import { GetWorkspaceFSPath } from './get-workspace-fs-path';
import { MergeConfig } from './merge-config';

/**
 * Reference to the URI for the first folder we open, need a value in case
 * there are no open workspace folders
 */
export const FIRST_FOLDER2 = 'default';

/**
 * track configuration of all open workspaces
 */
export const WORKSPACE_FOLDER_CONFIGS: {
  [key: string]: IDLExtensionConfig;
} = {};

/**
 * Configuration for our session of VSCode
 */
export let IDL_CLIENT_CONFIG = DEFAULT_IDL_EXTENSION_CONFIG;

/**
 * Helper to normalize the config files that we track
 */
async function PopulateWorkspaceConfigs(folders: string[]) {
  // pull new configs
  for (let i = 0; i < folders.length; i++) {
    WORKSPACE_FOLDER_CONFIGS[folders[i]] =
      await SERVER_CONNECTION.workspace.getConfiguration({
        scopeUri: URI.file(folders[i]).toString(),
        section: LANGUAGE_NAME,
      });
  }
}

/**
 * Manages tracking configuration for workspace folders
 */
export async function TrackWorkspaceConfigs(folders: WorkspaceFolder[]) {
  const foldersFs = folders.map((folder) => GetWorkspaceFSPath(folder));

  // get workspace configs
  await PopulateWorkspaceConfigs(foldersFs);

  // merge configs, get folders
  const info = MergeConfig();

  // track folders
  for (let i = 0; i < foldersFs.length; i++) {
    // indicate that we need to add to our path
    info.folders.added[foldersFs[i]] = true;
  }

  // merge and update
  return info;
}

/**
 * Removes tracked workspace folders from our configs
 */
export function RemoveWorkspaceConfigs(folders: WorkspaceFolder[]) {
  const foldersFs = folders.map((folder) => GetWorkspaceFSPath(folder));

  // add preferences for added folders
  for (let i = 0; i < folders.length; i++) {
    // get config before we do any processing
    delete WORKSPACE_FOLDER_CONFIGS[foldersFs[i]];
  }

  // merge config
  const info = MergeConfig();

  // indicate we need to remove our workspace folders
  for (let i = 0; i < foldersFs.length; i++) {
    info.folders.removed[foldersFs[i]] = true;
  }

  // merge and update
  return info;
}

/**
 * Updates the configuration for our client, not a folder associated with it
 *
 * The config from VSCode remove paths and makes a nested object, which is
 * super annoying since thats not how the UI works at all
 */
export async function UpdateClientFolderConfig(config: IDLExtensionConfig) {
  // update setting from VSCode
  IDL_CLIENT_CONFIG = config;

  // get currently tracked workspaces
  const folders = Object.keys(WORKSPACE_FOLDER_CONFIGS);

  // get workspace configs
  await PopulateWorkspaceConfigs(folders);

  // merge and update
  return MergeConfig();
}
