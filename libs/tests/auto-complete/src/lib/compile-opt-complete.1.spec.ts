import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provides auto complete for`, () => {
  it(`[auto generated] compile opt statements`, async () => {
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
      'idl/test/auto-complete/compile_opt_complete.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 1, character: 12 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'idl2', kind: 20, sortText: '04' },
      { label: 'idl3', kind: 20, sortText: '04' },
      { label: 'defint32', kind: 20, sortText: '04' },
      { label: 'float64', kind: 20, sortText: '04' },
      { label: 'hidden', kind: 20, sortText: '04' },
      { label: 'logical_predicate', kind: 20, sortText: '04' },
      { label: 'nosave', kind: 20, sortText: '04' },
      { label: 'obsolete', kind: 20, sortText: '04' },
      { label: 'static', kind: 20, sortText: '04' },
      { label: 'strictarr', kind: 20, sortText: '04' },
      { label: 'strictarrsubs', kind: 20, sortText: '04' },
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
    // define position
    const position_1: Position = { line: 3, character: 17 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      { label: 'idl3', kind: 20, sortText: '04' },
      { label: 'defint32', kind: 20, sortText: '04' },
      { label: 'float64', kind: 20, sortText: '04' },
      { label: 'hidden', kind: 20, sortText: '04' },
      { label: 'logical_predicate', kind: 20, sortText: '04' },
      { label: 'nosave', kind: 20, sortText: '04' },
      { label: 'obsolete', kind: 20, sortText: '04' },
      { label: 'static', kind: 20, sortText: '04' },
      { label: 'strictarr', kind: 20, sortText: '04' },
      { label: 'strictarrsubs', kind: 20, sortText: '04' },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
  });
});
