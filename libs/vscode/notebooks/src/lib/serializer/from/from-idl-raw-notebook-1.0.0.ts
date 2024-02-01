import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDLRawNotebook,
  IDLRawNotebookVersion_1_0_0,
} from '@idl/types/notebooks';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { FromIDLRawNotebook } from './from-idl-raw-notebook.interface';

/**
 * Function that loads a 1.0.0 raw notebook
 */
export const FromIDLRawNotebook_1_0_0: FromIDLRawNotebook<IDLRawNotebookVersion_1_0_0> =
  async function (
    parsed: IDLRawNotebook<IDLRawNotebookVersion_1_0_0>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ) {
    /**
     * Cells that we parse
     */
    const cells: vscode.NotebookCellData[] = [];

    /**
     * track error for outputs we fail to parse
     */
    let failedOutput: any;

    // process each parsed cell
    for (let i = 0; i < parsed.cells.length; i++) {
      /** Create our cell */
      const cell = new vscode.NotebookCellData(
        parsed.cells[i].type === 'code'
          ? vscode.NotebookCellKind.Code
          : vscode.NotebookCellKind.Markup,
        Buffer.from(parsed.cells[i].content, 'base64').toString(),
        parsed.cells[i].type === 'code' ? IDL_LANGUAGE_NAME : 'markdown'
      );

      // check for metadata
      if (parsed.cells[i].metadata !== undefined) {
        cell.metadata = parsed.cells[i].metadata;
      }

      // check for outputs
      if (parsed.cells[i].outputs !== undefined) {
        try {
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
        } catch (err) {
          failedOutput = err;
        }
      }

      // save our cell
      cells.push(cell);
    }

    // check if we failed to load our outputs
    if (failedOutput) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [
          IDL_TRANSLATION.notebooks.errors.errorLoadOutputs,
          failedOutput,
        ],
        alert: IDL_TRANSLATION.notebooks.errors.errorLoadOutputs,
      });
    }

    // create a notebook from our cells
    return new vscode.NotebookData(cells);
  };
