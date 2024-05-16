import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDL_RAW_NOTEBOOK_VERSION_LOOKUP } from '@idl/types/notebooks';
import { IDL_LOGGER } from '@idl/vscode/client';
import { performance } from 'perf_hooks';
import * as vscode from 'vscode';

import { FromIDLRawNotebook } from './from/from-idl-raw-notebook';
import { ToIDLRawNotebook } from './to/to-idl-raw-notebook';

/**
 * Parses/serializes notebook data
 */
export class IDLNotebookSerializer {
  /**
   * Converts a serialized notebook back to a notebook document that
   * VSCode can render
   */
  async deserializeNotebook(
    content: Uint8Array,
    _token: vscode.CancellationToken
  ): Promise<vscode.NotebookData> {
    /**
     * Get start time
     */
    const t0 = performance.now();

    /**
     * Parse and convert to a VSCode notebook
     */
    const nb = await FromIDLRawNotebook(content, _token);

    // log load time for NB
    IDL_LOGGER.log({
      type: 'debug',
      log: IDL_NOTEBOOK_LOG,
      content: `It took ${Math.floor(
        performance.now() - t0
      )} ms to deserialize notebook`,
    });

    // return cells as VSCode notebook data
    return nb;
  }

  /**
   * Converts notebook document to a string to be written to disk
   */
  async serializeNotebook(
    data: vscode.NotebookData,
    _token: vscode.CancellationToken
  ): Promise<Uint8Array> {
    /**
     * Get start time
     */
    const t0 = performance.now();

    /**
     * Encode notebook as array of bytes
     */
    const encoded = await ToIDLRawNotebook(
      IDL_RAW_NOTEBOOK_VERSION_LOOKUP._2_0_0,
      data,
      _token
    );

    // print some debug information about
    IDL_LOGGER.log({
      type: 'debug',
      log: IDL_NOTEBOOK_LOG,
      content: `It took ${Math.floor(
        performance.now() - t0
      )} ms to serialize notebook to ${Math.floor(encoded.length / 1024)} kb`,
    });

    // return encoded string
    return encoded;
  }
}
