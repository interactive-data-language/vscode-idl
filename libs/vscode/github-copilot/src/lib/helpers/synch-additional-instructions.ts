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

let debounceTimer: NodeJS.Timeout | undefined;

export async function ReadInstructions(): Promise<string> {
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
    return ''; // Return empty string on error
  }
}

export async function SyncInstructionsFromFileToSetting() {
  // From file
  let existingInstructions = await ReadInstructions();

  // If file read failed, nothing to sync
  if (!existingInstructions) {
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
 * Watches for changes to the custom instructions setting
 */

async function CBHandleConfigChange(ev: vscode.ConfigurationChangeEvent) {
  // Only act if our specific setting changed
  if (!ev.affectsConfiguration(FULL_SETTING_KEY)) {
    return;
  }

  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timer - only execute after user stops changing settings
  debounceTimer = setTimeout(async () => {
    try {
      // Read our instructions file in to make some changes.
      const fileContent = await ReadInstructions();

      // we dont know where our file is, or if it exists... Skip.
      if (fileContent === '') {
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
      const newContent = beforeMarker + '\n\n' + MARKER + '\n\n' + value;
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

// if the custom instructions setting change, update the file with a CB
export function WatchCustomInstructionsChanges(): vscode.Disposable {
  // return disposable so it can be pushed onto subscriptions and then disposed on shutdown
  const listener =
    vscode.workspace.onDidChangeConfiguration(CBHandleConfigChange);

  return {
    dispose() {
      listener.dispose();
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
      }
    },
  };
}
