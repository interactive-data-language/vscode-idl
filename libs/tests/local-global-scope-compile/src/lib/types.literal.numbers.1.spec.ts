import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';
import { ILocalTokens } from '@idl/types/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Cases to make sure we parse literal types`, () => {
  it(`[auto generated] for literal numbers`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      ``,
      `;+`,
      `; :Returns: 1 | 2 | 3.0 | 4`,
      `;`,
      `;-`,
      `function testNumber1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: { testnumber1: {} },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'testnumber1',
        pos: [5, 9, 11],
        range: { start: [5, 0, 9], end: [8, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: 1 | 2 | 3.0 | 4\n;-\nresult = testNumber1()\n```\n\n\n',
          docsLookup: { default: '', returns: '1 | 2 | 3.0 | 4' },
          display: 'testNumber1',
          kws: {},
          private: false,
          returns: [
            {
              name: 'Float',
              display: 'Float',
              serialized: '1 | 2 | 3.0 | 4',
              args: [],
              meta: {},
              value: ['1', '2', '3.0', '4'],
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { testnumber1: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
