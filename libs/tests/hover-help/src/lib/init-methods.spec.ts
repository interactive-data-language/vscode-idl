import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify hover-help for`, () => {
  it(`[auto generated] init methods`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/init_method.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 13, character: 14 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22MyClass%22%7D)',
      '',
      '```idl',
      'result = MyClass.init( [ /kw2 ])',
      '```',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **kw2**: in, optional, Boolean',
      '',
      '    Placeholder docs for argument, keyword, or property',
      '',
      '',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_1: Position = { line: 16, character: 19 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type kw2 = Boolean',
      '```',
      '',
      'Placeholder docs for argument, keyword, or property',
    ];

    // get hover help
    const hoverHelp_1 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_1
    );

    // verify results
    expect(expectedFound_1).toEqual(
      ((hoverHelp_1?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
