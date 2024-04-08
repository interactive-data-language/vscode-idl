import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for`, () => {
  it(`[auto generated] incorrect function call`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/syntax_error.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 1, character: 8 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/BYTARR.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22bytarr%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: Array<Byte>',
      ';+',
      'result = bytarr(d1, d2, d3, d4, d5, d6, d7, d8, $',
      '  /nozero)',
      '```',
      '',
      'The BYTARR function creates a byte vector or array.',
      '',
      '',
      '#### Arguments',
      '',
      '- **d1**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d2**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d3**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d4**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d5**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d6**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d7**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d8**: in, optional, Number',
      '',
      '  ',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **nozero**: in, optional, Boolean',
      '',
      '    Normally, BYTARR sets every element of the result to zero. If the NOZERO keyword is set, this zeroing is not performed (array elements contain random values) and BYTARR executes faster.',
      '',
      '',
      '',
      '### Examples',
      '',
      'To create B as a 3 by 3 by 5 byte array where each element is set to a random value, enter:',
      '',
      '```idl',
      '  B = bytarr(3, 3, 5, /nozero)',
      '  print, B',
      '```',
      '',
      '### Return Value',
      '',
      'This function returns a byte vector or array.',
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

  it(`[auto generated] the end of the function call start (regression test for crash)`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/syntax_error.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 1, character: 11 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/BYTARR.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22bytarr%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: Array<Byte>',
      ';+',
      'result = bytarr(d1, d2, d3, d4, d5, d6, d7, d8, $',
      '  /nozero)',
      '```',
      '',
      'The BYTARR function creates a byte vector or array.',
      '',
      '',
      '#### Arguments',
      '',
      '- **d1**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d2**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d3**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d4**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d5**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d6**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d7**: in, optional, Number',
      '',
      '  ',
      '',
      '- **d8**: in, optional, Number',
      '',
      '  ',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **nozero**: in, optional, Boolean',
      '',
      '    Normally, BYTARR sets every element of the result to zero. If the NOZERO keyword is set, this zeroing is not performed (array elements contain random values) and BYTARR executes faster.',
      '',
      '',
      '',
      '### Examples',
      '',
      'To create B as a 3 by 3 by 5 byte array where each element is set to a random value, enter:',
      '',
      '```idl',
      '  B = bytarr(3, 3, 5, /nozero)',
      '  print, B',
      '```',
      '',
      '### Return Value',
      '',
      'This function returns a byte vector or array.',
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
