import { USER_AGENT_INSTRUCTIONS_FOLDER } from '@idl/idl/files';
import { IDL_COPILOT_VSCODE_LOG } from '@idl/logger';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { join } from 'path';
import * as vscode from 'vscode';

import {
  IInstructionsSyncOptions,
  INSTRUCTIONS_SYNC_DEBOUNCE_MS,
  INSTRUCTIONS_SYNC_MARKER,
} from './instructions-sync.interface';

export class InstructionsSync {
  private fileDebounceTimer: NodeJS.Timeout | undefined;
  private settingDebounceTimer: NodeJS.Timeout | undefined;

  constructor(private readonly options: IInstructionsSyncOptions) {}

  /**
   * Reads the raw content of the instructions file from disk.
   * Returns null if the file does not exist or cannot be read.
   */
  async readInstructions(): Promise<null | string> {
    const filePath = join(
      USER_AGENT_INSTRUCTIONS_FOLDER,
      this.options.instructionsFile,
    );
    const fileUri = vscode.Uri.file(filePath);
    try {
      const fileData = await vscode.workspace.fs.readFile(fileUri);
      return new TextDecoder().decode(fileData);
    } catch (err) {
      IDL_LOGGER.log({
        log: IDL_COPILOT_VSCODE_LOG,
        type: 'error',
        content: [
          `Problem reading IDL GitHub Copilot instructions from file: ${this.options.instructionsFile}`,
          err,
        ],
      });
      return null;
    }
  }

  /**
   * Reads the instructions file and extracts the content after the
   * ADDITIONAL INSTRUCTIONS marker, then writes that content to the
   * corresponding VS Code setting (if it has changed).
   */
  async syncFromFileToSetting() {
    let existingInstructions = await this.readInstructions();

    if (existingInstructions === null) {
      return;
    }

    const parts = existingInstructions.split(
      new RegExp(INSTRUCTIONS_SYNC_MARKER, 'i'),
    );
    if (parts.length > 1) {
      existingInstructions = parts[1].trimStart();
    } else {
      existingInstructions = '';
    }

    const config = vscode.workspace.getConfiguration(
      this.options.configNamespace,
    );
    const current = config.get<string>(this.options.settingKey);

    if (current !== existingInstructions) {
      await config.update(
        this.options.settingKey,
        existingInstructions,
        vscode.ConfigurationTarget.Global,
      );
    }
  }

  /**
   * Reads the current VS Code setting value and writes it back to the
   * instructions file, preserving any content that appears before the
   * ADDITIONAL INSTRUCTIONS marker.
   */
  async syncFromSettingToFile() {
    try {
      const fileContent = await this.readInstructions();

      if (fileContent === null) {
        return;
      }

      const parts = fileContent.split(
        new RegExp(INSTRUCTIONS_SYNC_MARKER, 'i'),
      );
      const beforeMarker = parts[0].trim();

      const config = vscode.workspace.getConfiguration(
        this.options.configNamespace,
      );
      const value = config.get<string>(this.options.settingKey, '');

      const filePath = join(
        USER_AGENT_INSTRUCTIONS_FOLDER,
        this.options.instructionsFile,
      );
      const fileUri = vscode.Uri.file(filePath);
      const newContent = `${beforeMarker}\n\n${INSTRUCTIONS_SYNC_MARKER}\n\n${value}`;
      await vscode.workspace.fs.writeFile(
        fileUri,
        new TextEncoder().encode(newContent),
      );
    } catch (err) {
      IDL_LOGGER.log({
        log: IDL_COPILOT_VSCODE_LOG,
        type: 'error',
        content: ['Failed to sync Custom Instructions to file', err],
      });
    }
  }

  /**
   * Creates a file system watcher for the instructions file.
   * When the file is created or changed, syncs its content back to
   * the corresponding VS Code setting (debounced).
   */
  watchFileChanges(): vscode.Disposable {
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(
        USER_AGENT_INSTRUCTIONS_FOLDER,
        this.options.instructionsFile,
      ),
    );

    const handle = () => {
      if (this.fileDebounceTimer) {
        clearTimeout(this.fileDebounceTimer);
      }
      this.fileDebounceTimer = setTimeout(async () => {
        await this.syncFromFileToSetting();
      }, INSTRUCTIONS_SYNC_DEBOUNCE_MS);
    };

    watcher.onDidChange(handle);
    watcher.onDidCreate(handle);

    return {
      dispose: () => {
        watcher.dispose();
        if (this.fileDebounceTimer) {
          clearTimeout(this.fileDebounceTimer);
          this.fileDebounceTimer = undefined;
        }
      },
    };
  }

  /**
   * Watches for VS Code configuration changes to the setting key.
   * When the setting changes, syncs its value back to the instructions
   * file (debounced).
   */
  watchSettingChanges(): vscode.Disposable {
    const fullKey = `${this.options.configNamespace}.${this.options.settingKey}`;

    const listener = vscode.workspace.onDidChangeConfiguration(async (ev) => {
      if (!ev.affectsConfiguration(fullKey)) {
        return;
      }

      if (this.settingDebounceTimer) {
        clearTimeout(this.settingDebounceTimer);
      }

      this.settingDebounceTimer = setTimeout(async () => {
        await this.syncFromSettingToFile();
      }, INSTRUCTIONS_SYNC_DEBOUNCE_MS);
    });

    return {
      dispose: () => {
        listener.dispose();
        if (this.settingDebounceTimer) {
          clearTimeout(this.settingDebounceTimer);
          this.settingDebounceTimer = undefined;
        }
      },
    };
  }
}
