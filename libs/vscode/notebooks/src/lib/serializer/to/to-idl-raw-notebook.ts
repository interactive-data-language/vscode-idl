import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { EncodeNotebook } from '@idl/notebooks/shared';
import { IDLRawNotebook, IDLRawNotebookVersion } from '@idl/notebooks/types';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { ToIDLRawNotebook_1_0_0 } from './to-idl-raw-notebook-1.0.0';
import { ToIDLRawNotebook_2_0_0 } from './to-idl-raw-notebook-2.0.0';

/**
 * Converts notebook data to a raw IDL notebook
 */
export async function ToIDLRawNotebook<T extends IDLRawNotebookVersion>(
  version: T,
  data: vscode.NotebookData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _token: vscode.CancellationToken
): Promise<Uint8Array> {
  /**
   * Clean up cell metadata
   */
  for (let i = 0; i < data.cells.length; i++) {
    if (data.cells[i].metadata !== undefined) {
      delete data.cells[i].metadata['id'];
    }
  }

  /**
   * Create default notebook in case there are problems
   */
  let nb: IDLRawNotebook<T> = {
    version: version,
    cells: [],
  };

  // check for top-level metadata
  if (data.metadata !== undefined) {
    nb.metadata = data.metadata;
  }

  /**
   * Attempt to parse and restore
   */
  try {
    // determine the version and parse
    switch (version) {
      case '2.0.0':
        nb = (await ToIDLRawNotebook_2_0_0(data, _token)) as IDLRawNotebook<T>;
        break;
      case '1.0.0':
        nb = (await ToIDLRawNotebook_1_0_0(data, _token)) as IDLRawNotebook<T>;
        break;
      default:
        throw new Error(
          `Unable to save as unknown notebook version "${version}"`
        );
    }
  } catch (err) {
    IDL_LOGGER.log({
      type: 'error',
      log: IDL_NOTEBOOK_LOG,
      content: [IDL_TRANSLATION.notebooks.errors.errorSaving, err],
      alert: IDL_TRANSLATION.notebooks.errors.errorSaving,
    });
  }

  return EncodeNotebook(nb);
}
