/** Marker that separates static file content from user-editable additional instructions */
export const INSTRUCTIONS_SYNC_MARKER = '## ADDITIONAL INSTRUCTIONS';

/** Debounce delay in milliseconds before syncing after a change */
export const INSTRUCTIONS_SYNC_DEBOUNCE_MS = 500;

export interface IInstructionsSyncOptions {
  /** VS Code configuration namespace (e.g. 'idl') */
  configNamespace: string;
  /** Filename of the instructions file (e.g. 'idl.instructions.md') */
  instructionsFile: string;
  /** VS Code setting key within the namespace (e.g. 'copilot.customInstructions') */
  settingKey: string;
}
