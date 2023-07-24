import expect from 'expect';
import * as vscode from 'vscode';

/**
 * Verifies that a notebook is empty
 */
export function VerifyEmpty(nb: vscode.NotebookDocument) {
  /**
   * get notebook cells
   */
  const cells = nb.getCells();

  // track number of output cells
  let nOut = 0;

  // validate outputs from all known cells
  for (let i = 0; i < cells.length; i++) {
    /**
     * get notebook cell
     */
    const nbCell = cells[i];

    // get output mime types
    let mimes: string[] = [];
    for (let j = 0; j < nbCell.outputs.length; j++) {
      mimes = mimes.concat(nbCell.outputs[j].items.map((item) => item.mime));
    }

    // track total output
    nOut += mimes.length;
  }

  // validate cell mime types
  expect(nOut).toEqual(0);
}
