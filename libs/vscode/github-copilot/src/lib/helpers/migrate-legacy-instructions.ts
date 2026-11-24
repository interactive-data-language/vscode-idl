import {
  OLD_USER_AGENT_INSTRUCTIONS_FOLDER,
  OLD_USER_AGENTS_FOLDER,
  OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER,
  USER_AGENT_INSTRUCTIONS_FOLDER,
} from '@idl/idl/files';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from 'fs';
import { basename, extname, join } from 'path';
import * as vscode from 'vscode';

import { HomeRelativePath } from './home-relative-path';

/**
 * Moves a file, falling back to copy and delete if we cross devices
 */
function MoveFile(source: string, destination: string) {
  try {
    renameSync(source, destination);
  } catch {
    cpSync(source, destination);
    rmSync(source, { force: true });
  }
}

/**
 * Gets a destination path that does not exist yet by adding a suffix
 * before the extension (i.e. `file-migrated.instructions.md`)
 */
function GetAvailablePath(folder: string, name: string) {
  let dest = join(folder, name);
  if (!existsSync(dest)) {
    return dest;
  }

  // keep the full ".instructions.md" extension so Copilot still finds the file
  const ext = name.endsWith('.instructions.md')
    ? '.instructions.md'
    : extname(name);
  const base = name.slice(0, name.length - ext.length);

  let count = 0;
  while (existsSync(dest)) {
    count++;
    dest = join(folder, `${base}-migrated${count > 1 ? count : ''}${ext}`);
  }
  return dest;
}

/**
 * Migrates instructions from the legacy "~/.idl/agents" folders to the
 * native GitHub Copilot instructions folder.
 *
 * - Files that the extension manages are deleted (they get recreated)
 * - Custom user files are moved so they are preserved
 * - Old folders are removed from the `chat.instructionsFilesLocations` setting
 */
export async function MigrateLegacyInstructions() {
  // move user files
  if (existsSync(OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER)) {
    mkdirSync(USER_AGENT_INSTRUCTIONS_FOLDER, { recursive: true });

    const items = readdirSync(OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER);
    for (let i = 0; i < items.length; i++) {
      const source = join(OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER, items[i]);
      if (!statSync(source).isFile()) {
        continue;
      }
      MoveFile(
        source,
        GetAvailablePath(USER_AGENT_INSTRUCTIONS_FOLDER, basename(source)),
      );
    }
  }

  // remove old folders
  rmSync(OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER, {
    recursive: true,
    force: true,
  });
  rmSync(OLD_USER_AGENT_INSTRUCTIONS_FOLDER, { recursive: true, force: true });

  // remove old locations from settings
  const config = vscode.workspace.getConfiguration('chat');
  const settingKey = 'instructionsFilesLocations';
  const filesLocations = {
    ...(config.get<Record<string, boolean>>(settingKey) || {}),
  };

  const oldFolders = [
    OLD_USER_AGENT_INSTRUCTIONS_FOLDER,
    OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER,
    OLD_USER_AGENTS_FOLDER,
  ];
  const oldPrefixes = oldFolders.concat(oldFolders.map(HomeRelativePath));

  let changed = false;
  const keys = Object.keys(filesLocations);
  for (let i = 0; i < keys.length; i++) {
    if (oldPrefixes.some((prefix) => keys[i].startsWith(prefix))) {
      delete filesLocations[keys[i]];
      changed = true;
    }
  }

  if (changed) {
    await config.update(
      settingKey,
      filesLocations,
      vscode.ConfigurationTarget.Global,
    );
  }
}
