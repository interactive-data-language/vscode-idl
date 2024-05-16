import {
  IDLRawNotebook,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/types/notebooks';
import expect from 'expect';
import { readFileSync } from 'fs';

/**
 * gets outputs that we can compare
 */
function GetOutputs(data: IDLRawNotebook<IDLRawNotebookVersion_2_0_0>) {
  return data.cells
    .map((cell) =>
      (cell.outputs || [])
        .map((output) =>
          output.items
            .map((item) =>
              Array.isArray(item.content)
                ? item.content.join('\n').trimEnd().split(/\n/gim)
                : [item.content.trimEnd()]
            )
            .flat()
        )
        .flat()
    )
    .flat();
}

/**
 * Compares the JSON text content of two notebook files on disk
 */
export async function CompareNotebookJSONOutputs(
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
  expect(GetOutputs(refData)).toEqual(GetOutputs(actualData));
}
