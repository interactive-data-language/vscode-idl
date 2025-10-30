import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Cases to make sure we always merge literal types and generic types`, () => {
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
      `;+`,
      `; :Returns: 1 | 2 | Number`,
      `;-`,
      `function testMergeNumber1`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns: 1 | Number | 2`,
      `;`,
      `;-`,
      `function testMergeNumber2`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns: Number | 1 | 2`,
      `;`,
      `;-`,
      `function testMergeNumber3`,
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
      func: {
        testmergenumber3: {},
        testmergenumber2: {},
        testmergenumber1: {},
      },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'testmergenumber3',
        pos: [22, 9, 16],
        range: { start: [22, 0, 9], end: [25, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: Number\n;+\nresult = testMergeNumber3()\n```\n\n\n',
          docsLookup: { default: '', returns: 'Number | 1 | 2' },
          display: 'testMergeNumber3',
          kws: {},
          private: false,
          returns: [
            {
              name: 'Number',
              display: 'Number',
              serialized: 'Number',
              args: [],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'testmergenumber2',
        pos: [13, 9, 16],
        range: { start: [13, 0, 9], end: [16, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: Number\n;+\nresult = testMergeNumber2()\n```\n\n\n',
          docsLookup: { default: '', returns: '1 | Number | 2' },
          display: 'testMergeNumber2',
          kws: {},
          private: false,
          returns: [
            {
              name: 'Number',
              display: 'Number',
              serialized: 'Number',
              args: [],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'testmergenumber1',
        pos: [3, 9, 16],
        range: { start: [3, 0, 9], end: [7, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: Number\n;+\nresult = testMergeNumber1()\n```\n\n\n',
          docsLookup: { default: '', returns: '1 | 2 | Number' },
          display: 'testMergeNumber1',
          kws: {},
          private: false,
          returns: [
            {
              name: 'Number',
              display: 'Number',
              serialized: 'Number',
              args: [],
              meta: {},
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
      func: {
        testmergenumber3: ['idl2'],
        testmergenumber2: ['idl2'],
        testmergenumber1: ['idl2'],
      },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
