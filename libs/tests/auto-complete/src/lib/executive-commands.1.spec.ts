import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
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
      { label: '.compile', kind: 4, sortText: '90', insertText: 'compile' },
      { label: '.continue', kind: 4, sortText: '90', insertText: 'continue' },
      { label: '.edit', kind: 4, sortText: '90', insertText: 'edit' },
      {
        label: '.full_reset_session',
        kind: 4,
        sortText: '90',
        insertText: 'full_reset_session',
      },
      { label: '.go', kind: 4, sortText: '90', insertText: 'go' },
      { label: '.out', kind: 4, sortText: '90', insertText: 'out' },
      {
        label: '.reset_session',
        kind: 4,
        sortText: '90',
        insertText: 'reset_session',
      },
      { label: '.return', kind: 4, sortText: '90', insertText: 'return' },
      { label: '.skip', kind: 4, sortText: '90', insertText: 'skip' },
      { label: '.step', kind: 4, sortText: '90', insertText: 'step' },
      { label: '.stepover', kind: 4, sortText: '90', insertText: 'stepover' },
      { label: '.trace', kind: 4, sortText: '90', insertText: 'trace' },
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

  it(`[auto generated] dont send anything if we have a space`, async () => {
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
    const position_0: Position = { line: 37, character: 11 };

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
  });

  it(`[auto generated] files for .compile`, async () => {
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
    const position_0: Position = { line: 38, character: 17 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'examples.pro', insertText: 'examples', kind: 17 },
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

  it(`[auto generated] files for .compile`, async () => {
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
    const position_0: Position = { line: 39, character: 9 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'examples.pro', insertText: 'examples', kind: 17 },
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

  it(`[auto generated] files for .compile`, async () => {
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
    const position_0: Position = { line: 40, character: 5 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'examples.pro', insertText: 'examples', kind: 17 },
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

  it(`[auto generated] files for .compile`, async () => {
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
    const position_0: Position = { line: 41, character: 6 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'examples.pro', insertText: 'examples', kind: 17 },
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

  it(`[auto generated] files for .compile`, async () => {
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
    const position_0: Position = { line: 42, character: 7 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'examples.pro', insertText: 'examples', kind: 17 },
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

  it(`[auto generated] files for .compile`, async () => {
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
    const position_0: Position = { line: 43, character: 8 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: 'examples.pro', insertText: 'examples', kind: 17 },
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

  it(`[auto generated] with just dot, send executive commands`, async () => {
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
    const position_0: Position = { line: 44, character: 1 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: '.compile', kind: 4, sortText: '90', insertText: 'compile' },
      { label: '.continue', kind: 4, sortText: '90', insertText: 'continue' },
      { label: '.edit', kind: 4, sortText: '90', insertText: 'edit' },
      {
        label: '.full_reset_session',
        kind: 4,
        sortText: '90',
        insertText: 'full_reset_session',
      },
      { label: '.go', kind: 4, sortText: '90', insertText: 'go' },
      { label: '.out', kind: 4, sortText: '90', insertText: 'out' },
      {
        label: '.reset_session',
        kind: 4,
        sortText: '90',
        insertText: 'reset_session',
      },
      { label: '.return', kind: 4, sortText: '90', insertText: 'return' },
      { label: '.skip', kind: 4, sortText: '90', insertText: 'skip' },
      { label: '.step', kind: 4, sortText: '90', insertText: 'step' },
      { label: '.stepover', kind: 4, sortText: '90', insertText: 'stepover' },
      { label: '.trace', kind: 4, sortText: '90', insertText: 'trace' },
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
