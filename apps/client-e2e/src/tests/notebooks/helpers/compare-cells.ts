import expect from 'expect';
import * as vscode from 'vscode';

import { ICompareCells } from './compare-cells.interface';

/**
 * Compares cells from a notebook against what we expect them to be
 */
export function CompareCells(
  nb: vscode.NotebookDocument,
  cellOutput: ICompareCells[]
) {
  /**
   * get notebook cells
   */
  const cells = nb.getCells();

  // validate outputs from all known cells
  for (let i = 0; i < cellOutput.length; i++) {
    /**
     * Get expected cell output
     */
    const expected = cellOutput[i];

    // debug log
    console.log(`  Comparing known output cell "${expected.idx}"`);

    /**
     * get notebook cell
     */
    const nbCell = cells[expected.idx];

    // make sure it exists
    expect(nbCell).not.toBeUndefined();

    // validate success if we have it
    if (nbCell.executionSummary.success !== undefined) {
      expect(nbCell.executionSummary.success).toEqual(expected.success);
    }

    // get output mime types
    let mimes: string[] = [];
    for (let j = 0; j < nbCell.outputs.length; j++) {
      mimes = mimes.concat(nbCell.outputs[j].items.map((item) => item.mime));
    }

    // validate cell mime types
    expect(mimes).toEqual(expected.mimeTypes);
  }
}
