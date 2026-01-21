import {
  IDLRawNotebook,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/types/notebooks';
import expect from 'expect';
import { readFileSync } from 'fs';

/**
 * gets outputs that we can compare
 */
function GetCells(data: IDLRawNotebook<IDLRawNotebookVersion_2_0_0>) {
  return data.cells.map((cell) =>
    cell.content.join('\n').trimEnd().split(/\n/gim)
  );
}

/**
 * Compares the JSON cells from two notebooks against one another
 */
export async function CompareNotebookJSONCells(
  referenceUri: string,
  actualUri: string
) {
  /**
   * Get reference notebook
   */
  const refData: IDLRawNotebook<IDLRawNotebookVersion_2_0_0> = JSON.parse(
    readFileSync(referenceUri, 'utf-8')
  );

  /**
   * Get actual notebook
   */
  const actualData: IDLRawNotebook<IDLRawNotebookVersion_2_0_0> = JSON.parse(
    readFileSync(actualUri, 'utf-8')
  );

  // compare
  expect(GetCells(refData)).toEqual(GetCells(actualData));
}
