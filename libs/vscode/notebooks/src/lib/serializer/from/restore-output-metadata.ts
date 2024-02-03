import {
  IDLNotebookOutputMetadata,
  NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE,
} from '@idl/types/notebooks';
import { nanoid } from 'nanoid';
import * as vscode from 'vscode';

/**
 * Restores output metadata so everything is present that we
 * expect for our mime types
 */
export function RestoreOutputMetadata(output: vscode.NotebookCellOutput) {
  /**
   * Get create cell metadata
   */
  const meta = output.metadata || {};

  /**
   * Create reference metadata
   */
  const reference: IDLNotebookOutputMetadata = {
    id: nanoid(),
  };

  // inherit all keys that we should have deleted
  for (let j = 0; j < NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE.length; j++) {
    meta[NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE[j]] =
      reference[NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE[j]];
  }

  // set metadata
  output.metadata = meta;
}
