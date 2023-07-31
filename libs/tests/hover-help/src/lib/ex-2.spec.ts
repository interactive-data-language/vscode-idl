import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly identifies keywords from routine calls`, () => {
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

    // define position
    const position_0: Position = { line: 24, character: 12 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22myfunc%22%7D)',
      '',
      '```idl',
      'result = myfunc( var1, $',
      ' [ /kw1 ])',
      '```',
      '',
      'My procedure',
      '',
      '#### Arguments',
      '',
      '- **var1**: in, required, any',
      '',
      '  My favorite thing',
      '',
      '',
      '#### Keywords',
      '',
      '- **kw1**: in, optional, Boolean',
      '',
      '    Super Cool flag',
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
    const position_1: Position = { line: 24, character: 20 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type var1 = any',
      '```',
      '',
      'My favorite thing',
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

    // define position
    const position_2: Position = { line: 27, character: 6 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      '```typescript',
      'var thing1: Long = 42',
      '```',
      '',
      'Second awesome variable with docs',
    ];

    // get hover help
    const hoverHelp_2 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_2
    );

    // verify results
    expect(expectedFound_2).toEqual(
      ((hoverHelp_2?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_3: Position = { line: 32, character: 6 };

    // define expected token we extract
    const expectedFound_3: string[] = [
      '```typescript',
      'var thing2: Long = 42',
      '```',
      '',
      'Second big comment block here',
      'like a great code writer',
    ];

    // get hover help
    const hoverHelp_3 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_3
    );

    // verify results
    expect(expectedFound_3).toEqual(
      ((hoverHelp_3?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_4: Position = { line: 40, character: 13 };

    // define expected token we extract
    const expectedFound_4: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22myfunc%22%7D)',
      '',
      '```idl',
      'result = myfunc( var1, $',
      ' [ /kw1 ])',
      '```',
      '',
      'My procedure',
      '',
      '#### Arguments',
      '',
      '- **var1**: in, required, any',
      '',
      '  My favorite thing',
      '',
      '',
      '#### Keywords',
      '',
      '- **kw1**: in, optional, Boolean',
      '',
      '    Super Cool flag',
      '',
      '',
    ];

    // get hover help
    const hoverHelp_4 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_4
    );

    // verify results
    expect(expectedFound_4).toEqual(
      ((hoverHelp_4?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
