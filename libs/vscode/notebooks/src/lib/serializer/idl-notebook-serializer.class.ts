import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import {
  DecodeNotebook,
  DecodeNotebookCellContent,
  EncodeNotebookCellContent,
  RawNotebook,
  RawNotebookCell,
} from '@idl/notebooks/shared';
import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import { performance } from 'perf_hooks';
import { TextEncoder } from 'util';
import * as vscode from 'vscode';

/**
 * Parses/serializes notebook data
 */
export class IDLNotebookSerializer implements vscode.NotebookSerializer {
  /**
   * Converts a serialized notebook back to a notebook document that
   * VSCode can render
   */
  async deserializeNotebook(
    content: Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ): Promise<vscode.NotebookData> {
    /**
     * Get start time
     */
    const t0 = performance.now();

    /**
     * Parsed notebook, placeholder in case we have error parsing file
     */
    let nb = new vscode.NotebookData([]);

    // attempt to parse file
    try {
      /**
       * Parse our notebook file
       */
      const parsed = DecodeNotebook(content);

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
          DecodeNotebookCellContent(parsed.cells[i].content),
          parsed.cells[i].type === 'code' ? IDL_LANGUAGE_NAME : 'markdown'
        );

        // check for metadata
        if (parsed.cells[i].metadata !== undefined) {
          cell.metadata = parsed.cells[i].metadata;
        }

        // check for outputs
        if (parsed.cells[i].outputs !== undefined) {
          cell.outputs = parsed.cells[i].outputs.map(
            (output) =>
              new vscode.NotebookCellOutput(
                output.items.map(
                  (item) =>
                    new vscode.NotebookCellOutputItem(
                      Buffer.from(item.data, 'base64'),
                      item.mime
                    )
                ),
                output.metadata
              )
          );
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ): Promise<Uint8Array> {
    /**
     * Get start time
     */
    const t0 = performance.now();

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
          content: EncodeNotebookCellContent(data.cells[i].value),
        };

        // check for metadata
        if (data.cells[i].metadata !== undefined) {
          rawCell.metadata = data.cells[i].metadata;
        }

        // check if we have output
        if (data.cells[i].outputs !== undefined) {
          rawCell.outputs = data.cells[i].outputs.map((out) => {
            return {
              items: out.items.map((item) => {
                return {
                  data: Buffer.from(item.data).toString('base64'),
                  mime: item.mime,
                };
              }),
              metadata: out.metadata,
            };
          });
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

    /**
     * Encode notebook as array of bytes
     */
    const encoded = new TextEncoder().encode(JSON.stringify(nb));

    /**
     * Compress
     */
    // const compressed = zlibSync(encoded, { level: 1 });

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
