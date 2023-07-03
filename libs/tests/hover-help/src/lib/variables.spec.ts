import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for`, () => {
  it(`[auto generated] system variables`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/variables.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 5, character: 2 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      'A variable of type _Undefined_. The value of !NULL can be:',
      '',
      '* Assigned to another variable: `var = !NULL`',
      '* Used to test whether a variable exists: `IF var NE !NULL THEN...`',
      '',
      'In addition, variables with the value !NULL are ignored when added to an array. That is:',
      '',
      '```idl',
      '  array = [1, !null, 2, !null, 3]',
      '```',
      '',
      'is the same as',
      '',
      '```idl',
      '  array = [1, 2, 3]',
      '```',
      '',
      'See [The Null Variable](https://www.nv5geospatialsoftware.com/docs/The_Null_Variable.html#constants_818058343_695602) for additional information.',
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
  });
});
