import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly get hover help`, () => {
  it(`[auto generated] for routine def files`, async () => {
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

    // define position
    const position_0: Position = { line: 25, character: 9 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22p%22,%22name%22:%22testroutine%22%7D)',
      '',
      '```idl',
      'testroutine, arg1, arg2, arg3, arg4, $',
      '  kw1 = value, $',
      '  kw2 = value',
      '```',
      '',
      'reference to our super cool and awesome plot',
      'sample if statement',
      'sample for loop',
      'sample ENVI routine',
      'formatting matches whatever you type as a user',
      '',
      '',
      '#### Arguments',
      '',
      '- **arg1**: bidirectional, required, any',
      '',
      '  Placeholder docs for argument, keyword, or property',
      '',
      '- **arg2**: bidirectional, required, any',
      '',
      '  Placeholder docs for argument, keyword, or property',
      '',
      '- **arg3**: bidirectional, required, any',
      '',
      '  Placeholder docs for argument, keyword, or property',
      '',
      '- **arg4**: bidirectional, required, any',
      '',
      '  Placeholder docs for argument, keyword, or property',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **kw1**: bidirectional, optional, any',
      '',
      '    Placeholder docs for argument, keyword, or property',
      '',
      '- **kw2**: bidirectional, optional, any',
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
  });
});
