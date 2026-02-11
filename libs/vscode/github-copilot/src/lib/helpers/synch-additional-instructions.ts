import { USER_COPILOT_INSTRUCTIONS_FOLDER } from '@idl/idl/files';
import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { join } from 'path';
import * as vscode from 'vscode';

const INSTRUCTIONS_FILE = 'idl.instructions.md';
const MARKER = '## ADDITIONAL INSTRUCTIONS';
const DEBOUNCE_MS = 500; // Wait 500ms after last change
const CONFIG_NAMESPACE = 'idl';
const SETTING_KEY = 'copilot.customInstructions';
const FULL_SETTING_KEY = `${CONFIG_NAMESPACE}.${SETTING_KEY}`;

let settingDebounceTimer: NodeJS.Timeout | undefined;
let fileDebounceTimer: NodeJS.Timeout | undefined;

/**
 * Reads the custom instructions from the file system.
 * @returns The file content, or null if the file doesn't exist or can't be read
 */
export async function readInstructions(): Promise<null | string> {
  const filePath = join(USER_COPILOT_INSTRUCTIONS_FOLDER, INSTRUCTIONS_FILE);
  const fileUri = vscode.Uri.file(filePath);
  try {
    const fileData = await vscode.workspace.fs.readFile(fileUri);
    const text = new TextDecoder().decode(fileData);

    return text;
  } catch (err) {
    IDL_LOGGER.log({
      log: IDL_COPILOT_VSCODE_LOG,
      type: 'error',
      content: [
        'Problem reading IDL GitHub Copilot instructions from file',
        err,
      ],
    });
    return null; // Return null on error to distinguish from empty content
  }
}

export async function syncInstructionsFromFileToSetting() {
  // From file
  let existingInstructions = await readInstructions();

  // If file read failed, nothing to sync
  if (existingInstructions === null) {
    return;
  }

  // Split on marker and extract content after it ("i" for case insensitive)
  const parts = existingInstructions.split(new RegExp(MARKER, 'i'));

  if (parts.length > 1) {
    existingInstructions = parts[1].trimStart();
  } else {
    existingInstructions = '';
  }

  // from settings
  const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
  const additionalInstructionsFromUser = config.get<string>(SETTING_KEY);

  if (additionalInstructionsFromUser !== existingInstructions) {
    await config.update(
      SETTING_KEY,
      existingInstructions,
      vscode.ConfigurationTarget.Global
    );
  }
}

/**
 * Handler for file changes - debounced to avoid excessive syncing
 */
function handleInstructionsFileChange() {
  if (fileDebounceTimer) {
    clearTimeout(fileDebounceTimer);
  }

  fileDebounceTimer = setTimeout(async function () {
    await syncInstructionsFromFileToSetting();
  }, DEBOUNCE_MS);
}

/**
 * Watches for changes to the custom instructions file and syncs to settings.
 * @returns Disposable to stop watching
 */
export function watchCustomInstructionsFileChanges(): vscode.Disposable {
  // Create a file watcher for the instructions file
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(
      USER_COPILOT_INSTRUCTIONS_FOLDER,
      INSTRUCTIONS_FILE
    )
  );

  watcher.onDidChange(handleInstructionsFileChange);
  watcher.onDidCreate(handleInstructionsFileChange);

  return {
    dispose() {
      watcher.dispose();
      if (fileDebounceTimer) {
        clearTimeout(fileDebounceTimer);
        fileDebounceTimer = undefined;
      }
    },
  };
}

/**
 * Handles configuration changes for custom instructions setting.
 * Debounced to avoid excessive file writes.
 */
async function handleConfigChange(ev: vscode.ConfigurationChangeEvent) {
  // Only act if our specific setting changed
  if (!ev.affectsConfiguration(FULL_SETTING_KEY)) {
    return;
  }

  // Clear existing timer
  if (settingDebounceTimer) {
    clearTimeout(settingDebounceTimer);
  }

  // Set new timer - only execute after user stops changing settings
  settingDebounceTimer = setTimeout(async () => {
    try {
      // Read current file content
      const fileContent = await readInstructions();

      // If file doesn't exist or can't be read, skip
      if (fileContent === null) {
        return;
      }

      // Split on marker - everything before becomes our base
      const parts = fileContent.split(new RegExp(MARKER, 'i'));
      const beforeMarker = parts[0].trim();

      // Content after the marker (Our new setting instructions)
      const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
      const value = config.get<string>(SETTING_KEY, '');

      // Write: before + marker + user content
      const filePath = join(
        USER_COPILOT_INSTRUCTIONS_FOLDER,
        INSTRUCTIONS_FILE
      );
      const fileUri = vscode.Uri.file(filePath);
      const newContent = `${beforeMarker}\n\n${MARKER}\n\n${value}`;
      const encoded = new TextEncoder().encode(newContent);

      await vscode.workspace.fs.writeFile(fileUri, encoded);
    } catch (err) {
      IDL_LOGGER.log({
        log: IDL_COPILOT_VSCODE_LOG,
        type: 'error',
        content: ['Failed to sync Custom Instructions to file', err],
      });
    }
  }, DEBOUNCE_MS);
}

/**
 * Watches for changes to the custom instructions setting and syncs to file.
 * @returns Disposable to stop watching
 */
export function watchCustomInstructionsChanges(): vscode.Disposable {
  const listener =
    vscode.workspace.onDidChangeConfiguration(handleConfigChange);

  return {
    dispose() {
      listener.dispose();
      if (settingDebounceTimer) {
        clearTimeout(settingDebounceTimer);
        settingDebounceTimer = undefined;
      }
    },
  };
}
