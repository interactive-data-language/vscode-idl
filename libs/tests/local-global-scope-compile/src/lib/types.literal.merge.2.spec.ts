import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Cases to make sure we always merge literal types and generic types`, () => {
  it(`[auto generated] for literal strings`, async () => {
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
      `; :Returns: '1' | "2" | String`,
      `;`,
      `;-`,
      `function testMergeString1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns: '1' | String | "2" `,
      `;`,
      `;-`,
      `function testMergeString2`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns: String | '1' | "2"`,
      `;`,
      `;-`,
      `function testMergeString3`,
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
        testmergestring3: {},
        testmergestring2: {},
        testmergestring1: {},
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
        name: 'testmergestring3',
        pos: [23, 9, 16],
        range: { start: [23, 0, 9], end: [26, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: String\n;+\nresult = testMergeString3()\n```\n\n\n',
          docsLookup: { default: '', returns: 'String | \'1\' | "2"' },
          display: 'testMergeString3',
          kws: {},
          private: false,
          returns: [
            {
              name: 'String',
              display: 'String',
              serialized: 'String',
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
        name: 'testmergestring2',
        pos: [14, 9, 16],
        range: { start: [14, 0, 9], end: [17, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: String\n;+\nresult = testMergeString2()\n```\n\n\n',
          docsLookup: { default: '', returns: '\'1\' | String | "2"' },
          display: 'testMergeString2',
          kws: {},
          private: false,
          returns: [
            {
              name: 'String',
              display: 'String',
              serialized: 'String',
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
        name: 'testmergestring1',
        pos: [5, 9, 16],
        range: { start: [5, 0, 9], end: [8, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: String\n;+\nresult = testMergeString1()\n```\n\n\n',
          docsLookup: { default: '', returns: '\'1\' | "2" | String' },
          display: 'testMergeString1',
          kws: {},
          private: false,
          returns: [
            {
              name: 'String',
              display: 'String',
              serialized: 'String',
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
        testmergestring3: ['idl2'],
        testmergestring2: ['idl2'],
        testmergestring1: ['idl2'],
      },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
