import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { DocumentSymbol } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Extracts outline`, () => {
  it(`[auto generated] for def files`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath(
      'idl/test/hover-help/testroutine.pro.def'
    );

    // add file to index
    await index.indexFile(filepath);

    // define outline we expect to extract
    const expected: DocumentSymbol[] = [
      {
        kind: 12,
        name: 'testroutine',
        range: {
          start: { line: 25, character: 4 },
          end: { line: 25, character: 15 },
        },
        selectionRange: {
          start: { line: 25, character: 4 },
          end: { line: 25, character: 15 },
        },
      },
    ];

    // verify results
    expect(expected).toEqual(
      await index.getOutline(
        filepath,
        await readFile(filepath, 'utf-8'),
        new CancellationToken()
      )
    );
  });
});
