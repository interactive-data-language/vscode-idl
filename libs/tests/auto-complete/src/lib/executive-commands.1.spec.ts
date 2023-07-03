import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly send only executive commands`, () => {
  it(`[auto generated] when we auto-complete`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/examples.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 36, character: 2 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: '.compile', kind: 4, sortText: '90' },
      { label: '.continue', kind: 4, sortText: '90' },
      { label: '.edit', kind: 4, sortText: '90' },
      { label: '.full_reset_session', kind: 4, sortText: '90' },
      { label: '.go', kind: 4, sortText: '90' },
      { label: '.out', kind: 4, sortText: '90' },
      { label: '.reset_session', kind: 4, sortText: '90' },
      { label: 'return', kind: 4, sortText: '90' },
      { label: '.skip', kind: 4, sortText: '90' },
      { label: '.step', kind: 4, sortText: '90' },
      { label: '.stepover', kind: 4, sortText: '90' },
      { label: '.trace', kind: 4, sortText: '90' },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
  });
});
