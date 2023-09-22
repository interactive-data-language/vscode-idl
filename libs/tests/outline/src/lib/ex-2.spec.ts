import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { DocumentSymbol } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Extracts outline with main`, () => {
  it(`[auto generated] extract correct tokens and handle undefined`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/myfunc.pro');

    // add file to index
    await index.indexFile(filepath);

    // define outline we expect to extract
    const expected: DocumentSymbol[] = [
      {
        kind: 12,
        name: 'mypro0',
        range: {
          start: { line: 0, character: 4 },
          end: { line: 0, character: 10 },
        },
        selectionRange: {
          start: { line: 0, character: 4 },
          end: { line: 0, character: 10 },
        },
      },
      {
        kind: 12,
        name: 'myfunc()',
        range: {
          start: { line: 24, character: 9 },
          end: { line: 24, character: 15 },
        },
        selectionRange: {
          start: { line: 24, character: 9 },
          end: { line: 24, character: 15 },
        },
      },
      {
        kind: 12,
        name: '$main$',
        range: {
          start: { line: 36, character: 0 },
          end: { line: 36, character: 20 },
        },
        selectionRange: {
          start: { line: 36, character: 0 },
          end: { line: 36, character: 20 },
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
