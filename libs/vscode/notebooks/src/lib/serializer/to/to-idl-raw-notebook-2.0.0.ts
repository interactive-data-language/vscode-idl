import {
  IDL_NOTEBOOK_MIME_TYPE,
  IDLRawNotebook,
  IDLRawNotebookCell,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/types/notebooks';
import * as vscode from 'vscode';

import { ToIDLRawNotebook } from './to-idl-raw-notebook.interface';

/**
 * Function that loads a 1.0.0 raw notebook
 */
export const ToIDLRawNotebook_2_0_0: ToIDLRawNotebook<IDLRawNotebookVersion_2_0_0> =
  async function (
    data: vscode.NotebookData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ) {
    /**
     * Array of raw notebook cells
     */
    const contents: IDLRawNotebookCell<IDLRawNotebookVersion_2_0_0>[] = [];

    // map cells from VSCode to our format
    for (let i = 0; i < data.cells.length; i++) {
      /** Make base cell */
      const rawCell: IDLRawNotebookCell<IDLRawNotebookVersion_2_0_0> = {
        type:
          data.cells[i].kind === vscode.NotebookCellKind.Code
            ? 'code'
            : 'markdown',
        content: data.cells[i].value.split(/\r?\n|\r/g),
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
              if (item.mime === IDL_NOTEBOOK_MIME_TYPE) {
                return {
                  mime: item.mime,
                  content: Buffer.from(item.data).toString(),
                };
              } else {
                return {
                  mime: item.mime,
                  content: Buffer.from(item.data).toString().split(/\r?\n/g),
                };
              }
            }),
            metadata: Object.assign({ id: 'not-saved' }, out.metadata),
          };
        });
      }

      // save cell
      contents.push(rawCell);
    }

    /**
     * Make our raw notebook data structure
     *
     * Standalone line because it gives us strict types
     */
    const nb: IDLRawNotebook<IDLRawNotebookVersion_2_0_0> = {
      version: '2.0.0',
      cells: contents,
    };

    // create a notebook from our cells
    return nb;
  };
