import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Exclude init method`, () => {
  it(`[auto generated] for function methods`, async () => {
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
    const position_0: Position = { line: 7, character: 12 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'IDLgrSurface::getCTM()',
        insertText: 'getCtm',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::editUserDefProperty()',
        insertText: 'editUserDefProperty',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getFullIdentifier()',
        insertText: 'getFullIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getPropertyByIdentifier()',
        insertText: 'getPropertyByIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::queryProperty()',
        insertText: 'queryProperty',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
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
