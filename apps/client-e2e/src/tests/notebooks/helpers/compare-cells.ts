import expect from 'expect';
import { deepEqual } from 'fast-equals';
import * as vscode from 'vscode';

import {
  ICompareCellAndOutputs,
  ICompareCellOutputs,
} from './compare-cells.interface';

/**
 * Compares cells from a notebook against what we expect them to be
 */
export async function CompareCellOutputs(
  nb: vscode.NotebookDocument,
  cellOutput: ICompareCellOutputs[]
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
    if (expected.success) {
      expect(nbCell.executionSummary?.success).toBeTruthy();
    } else {
      expect(nbCell.executionSummary?.success).toBeFalsy();
    }

    // get output mime types
    let mimes: string[] = [];
    for (let j = 0; j < nbCell.outputs.length; j++) {
      mimes = mimes.concat(nbCell.outputs[j].items.map((item) => item.mime));
    }

    if (!deepEqual(mimes, expected.mimeTypes)) {
      console.log(`--------------- PROBLEMS --------------------`);
      console.log(nbCell.outputs);

      await nb.save();
    }

    // validate cell mime types
    expect(mimes).toEqual(expected.mimeTypes);
  }
}

/**
 * Compares cells and outputs to make sure they match what we expect them to be
 */
export function CompareCellsAndOutputs(
  nb: vscode.NotebookDocument,
  cellsAndOutput: ICompareCellAndOutputs[]
) {
  /**
   * get notebook cells
   */
  const cells = nb.getCells();

  // validate outputs from all known cells
  for (let i = 0; i < cellsAndOutput.length; i++) {
    /**
     * Get expected cell output
     */
    const expected = cellsAndOutput[i];

    // debug log
    console.log(`  Comparing known cell and output "${expected.idx}"`);

    /**
     * get notebook cell
     */
    const nbCell = cells[expected.idx];

    // make sure it exists
    expect(nbCell).not.toBeUndefined();

    // make sure it exists
    expect(nbCell.kind).toBe(expected.kind);

    // get output mime types
    let mimes: string[] = [];
    for (let j = 0; j < nbCell.outputs.length; j++) {
      mimes = mimes.concat(nbCell.outputs[j].items.map((item) => item.mime));
    }

    // validate cell mime types
    expect(mimes).toEqual(expected.outputs);
  }
}
