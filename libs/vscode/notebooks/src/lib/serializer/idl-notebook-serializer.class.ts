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
    const contents = new TextDecoder().decode(content);

    let cells: vscode.NotebookCellData[] = [];

    /**
     * Raw notebook cell data
     */
    let raw: RawNotebookCell[] = [];

    // attempt to parse file
    try {
      // parse and retrieve cells
      raw = (<RawNotebook>JSON.parse(contents || DEFAULT_SERIALIZED_NOTEBOOK))
        .cells;

      // map to VSCode notebook cells
      cells = raw.map(
        (item) =>
          new vscode.NotebookCellData(
            item.type === 'code'
              ? vscode.NotebookCellKind.Code
              : vscode.NotebookCellKind.Markup,
            item.content.join('\n'),
            item.type === 'code' ? IDL_LANGUAGE_NAME : 'markdown'
          )
      );
    } catch (err) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.invalidNotebook, err],
        alert: IDL_TRANSLATION.notebooks.errors.invalidNotebook,
      });
    }

    // return cells as VSCode notebook data
    return new vscode.NotebookData(cells);
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
        contents.push({
          type:
            data.cells[i].kind === vscode.NotebookCellKind.Code
              ? 'code'
              : 'markdown',
          content: data.cells[i].value.split(/\r?\n/g),
        });
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

    return new TextEncoder().encode(JSON.stringify(nb));
  }
}
