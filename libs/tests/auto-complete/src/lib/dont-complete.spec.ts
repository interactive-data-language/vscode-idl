import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Don't do auto-complete`, () => {
  it(`[auto generated] for any of these`, async () => {
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
      'idl/test/auto-complete/dont_complete.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 1, character: 18 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [];

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
    const position_1: Position = { line: 1, character: 19 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [];

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
    // define position
    const position_2: Position = { line: 1, character: 34 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2
        )
      ).slice(0, 50)
    );
    // define position
    const position_3: Position = { line: 6, character: 9 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [];

    // verify results
    expect(expectedFound_3).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_3
        )
      ).slice(0, 50)
    );
    // define position
    const position_4: Position = { line: 6, character: 10 };

    // define expected token we extract
    const expectedFound_4: CompletionItem[] = [];

    // verify results
    expect(expectedFound_4).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_4
        )
      ).slice(0, 50)
    );
    // define position
    const position_5: Position = { line: 6, character: 25 };

    // define expected token we extract
    const expectedFound_5: CompletionItem[] = [];

    // verify results
    expect(expectedFound_5).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_5
        )
      ).slice(0, 50)
    );
    // define position
    const position_6: Position = { line: 13, character: 13 };

    // define expected token we extract
    const expectedFound_6: CompletionItem[] = [];

    // verify results
    expect(expectedFound_6).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_6
        )
      ).slice(0, 50)
    );
    // define position
    const position_7: Position = { line: 16, character: 2 };

    // define expected token we extract
    const expectedFound_7: CompletionItem[] = [];

    // verify results
    expect(expectedFound_7).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_7
        )
      ).slice(0, 50)
    );
    // define position
    const position_8: Position = { line: 17, character: 2 };

    // define expected token we extract
    const expectedFound_8: CompletionItem[] = [];

    // verify results
    expect(expectedFound_8).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_8
        )
      ).slice(0, 50)
    );
    // define position
    const position_9: Position = { line: 20, character: 9 };

    // define expected token we extract
    const expectedFound_9: CompletionItem[] = [];

    // verify results
    expect(expectedFound_9).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_9
        )
      ).slice(0, 50)
    );
    // define position
    const position_10: Position = { line: 21, character: 9 };

    // define expected token we extract
    const expectedFound_10: CompletionItem[] = [];

    // verify results
    expect(expectedFound_10).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_10
        )
      ).slice(0, 50)
    );
    // define position
    const position_11: Position = { line: 22, character: 9 };

    // define expected token we extract
    const expectedFound_11: CompletionItem[] = [];

    // verify results
    expect(expectedFound_11).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_11
        )
      ).slice(0, 50)
    );
    // define position
    const position_12: Position = { line: 25, character: 10 };

    // define expected token we extract
    const expectedFound_12: CompletionItem[] = [];

    // verify results
    expect(expectedFound_12).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_12
        )
      ).slice(0, 50)
    );
    // define position
    const position_13: Position = { line: 28, character: 10 };

    // define expected token we extract
    const expectedFound_13: CompletionItem[] = [];

    // verify results
    expect(expectedFound_13).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_13
        )
      ).slice(0, 50)
    );
  });
});
