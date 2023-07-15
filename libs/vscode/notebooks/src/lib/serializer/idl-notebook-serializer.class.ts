import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';

import {
  DEFAULT_SERIALIZED_NOTEBOOK,
  RawNotebook,
  RawNotebookCell,
} from './idl-notebook-serializer.interface';

/**
 * Parses/serializes notebook data
 */
export class IDLNotebookSerializer implements vscode.NotebookSerializer {
  async deserializeNotebook(
    content: Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ): Promise<vscode.NotebookData> {
    /**
     * Contents of the notebook file
     */
    const contents =
      new TextDecoder().decode(content) || DEFAULT_SERIALIZED_NOTEBOOK;

    /**
     * Parsed notebook, placeholder in case we have error parsing file
     */
    let nb = new vscode.NotebookData([]);

    // attempt to parse file
    try {
      /**
       * Parse our notebook file
       */
      const parsed: RawNotebook = JSON.parse(contents);

      /**
       * Cells that we parse
       */
      const cells: vscode.NotebookCellData[] = [];

      // process each parsed cell
      for (let i = 0; i < parsed.cells.length; i++) {
        /** Create our cell */
        const cell = new vscode.NotebookCellData(
          parsed.cells[i].type === 'code'
            ? vscode.NotebookCellKind.Code
            : vscode.NotebookCellKind.Markup,
          parsed.cells[i].content.join('\n'),
          parsed.cells[i].type === 'code' ? IDL_LANGUAGE_NAME : 'markdown'
        );

        // check for metadata
        if (parsed.cells[i].metadata !== undefined) {
          cell.metadata = parsed.cells[i].metadata;
        }

        // check for outputs
        if (parsed.cells[i].outputs !== undefined) {
          cell.outputs = parsed.cells[i].outputs;
        }

        // save our cell
        cells.push(cell);
      }

      // create a notebook from our cells
      nb = new vscode.NotebookData(cells);

      // check for top-level metadata
      if (parsed.metadata !== undefined) {
        nb.metadata = parsed.metadata;
      }
    } catch (err) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.invalidNotebook, err],
        alert: IDL_TRANSLATION.notebooks.errors.invalidNotebook,
      });
    }

    // return cells as VSCode notebook data
    return nb;
  }

  async serializeNotebook(
    data: vscode.NotebookData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ): Promise<Uint8Array> {
    /**
     * Array of raw notebook cells
     */
    const contents: RawNotebookCell[] = [];

    try {
      // map cells from VSCode to our format
      for (let i = 0; i < data.cells.length; i++) {
        /** Make base cell */
        const rawCell: RawNotebookCell = {
          type:
            data.cells[i].kind === vscode.NotebookCellKind.Code
              ? 'code'
              : 'markdown',
          content: data.cells[i].value.split(/\r?\n/g),
        };

        // check for metadata
        if (data.cells[i].metadata !== undefined) {
          rawCell.metadata = data.cells[i].metadata;
        }

        // check if we have output
        if (data.cells[i].outputs !== undefined) {
          rawCell.outputs = data.cells[i].outputs;
        }

        // save cell
        contents.push(rawCell);
      }
    } catch (err) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.errorSaving, err],
        alert: IDL_TRANSLATION.notebooks.errors.errorSaving,
      });
    }

    /**
     * Make our raw notebook data structure
     *
     * Standalone line because it gives us strict types
     */
    const nb: RawNotebook = {
      version: '1.0.0',
      cells: contents,
    };

    // check for top-level metadata
    if (data.metadata !== undefined) {
      nb.metadata = data.metadata;
    }

    return new TextEncoder().encode(JSON.stringify(nb));
  }
}
