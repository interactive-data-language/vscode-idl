import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { DecodeNotebook } from '@idl/notebooks/shared';
import {
  IDLRawNotebook,
  IDLRawNotebookVersion_1_0_0,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/notebooks/types';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { FromIDLRawNotebook_1_0_0 } from './from-idl-raw-notebook-1.0.0';
import { FromIDLRawNotebook_2_0_0 } from './from-idl-raw-notebook-2.0.0';
import { RestoreOutputMetadata } from './restore-output-metadata';

/**
 * Loads a notebook from the raw notebook content
 */
export async function FromIDLRawNotebook(
  content: Uint8Array,
  _token: vscode.CancellationToken
): Promise<vscode.NotebookData> {
  /**
   * Parsed notebook, placeholder in case we have error parsing file
   */
  let nb = new vscode.NotebookData([]);

  /**
   * Attempt to parse and restore
   */
  try {
    /**
     * Decode and convert to strings
     */
    const parsed = DecodeNotebook(content);

    // determine the version and parse
    switch (parsed.version) {
      /**
       * Check if version 2.0.0
       */
      case '2.0.0':
        nb = await FromIDLRawNotebook_2_0_0(
          parsed as IDLRawNotebook<IDLRawNotebookVersion_2_0_0>,
          _token
        );
        break;
      /**
       * Check if version 1.0.0
       */
      case '1.0.0':
        nb = await FromIDLRawNotebook_1_0_0(
          parsed as IDLRawNotebook<IDLRawNotebookVersion_1_0_0>,
          _token
        );
        break;
      default:
        throw new Error(
          `Unable to parse unknown notebook version "${parsed.version}"`
        );
    }

    /**
     * Get cells
     */
    const cells = nb.cells;

    /**
     * Restore cell output metadata
     */
    for (let i = 0; i < cells.length; i++) {
      const outputs = cells[i].outputs;
      if (outputs !== undefined) {
        for (let z = 0; z < outputs.length; z++) {
          RestoreOutputMetadata(outputs[z]);
        }
      }
    }

    // check for overall metadata
    if (parsed.metadata !== undefined) {
      nb.metadata = parsed.metadata;
    }
  } catch (err) {
    IDL_LOGGER.log({
      type: 'error',
      log: IDL_NOTEBOOK_LOG,
      content: [IDL_TRANSLATION.notebooks.errors.errorParsing, err],
      alert: IDL_TRANSLATION.notebooks.errors.errorParsing,
    });
  }

  return nb;
}
