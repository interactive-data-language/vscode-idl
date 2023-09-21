import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Only use code for docs`, () => {
  it(`[auto generated] and exclude incorrectly documented parameters`, async () => {
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
      `; Header`,
      `;`,
      `; :Args:`,
      `;   a: in, required, int`,
      `;     Some cool statement across`,
      `;`,
      `;     multiple lines`,
      `;   b: in, required, string`,
      `;     Some cool statement across`,
      `;`,
      `;     multiple lines`,
      `; :Keywords:`,
      `;   kw1: in, required, int`,
      `;     Some cool statement across`,
      `;`,
      `;     multiple lines`,
      `;   kw2: in, required, string`,
      `;     Some cool statement across`,
      `;`,
      `;     multiple lines`,
      `;`,
      `; :Author: Meeeeeeeeeeeeeeeeeee`,
      ``,
      ``,
      ``,
      ``,
      `pro myPro, a, kw1 = kw1`,
      ``,
      ``,
      ` print, 'Hello world'`,
      ``,
      ``,
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
      func: {},
      pro: {
        mypro: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [27, 20, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[27, 20, 3]],
              docs: 'Some cool statement across\n\nmultiple lines',
              source: 'user',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [27, 11, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[27, 11, 1]],
              docs: 'Some cool statement across\n\nmultiple lines',
              source: 'user',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'mypro',
        pos: [27, 4, 5],
        meta: {
          source: 'user',
          args: {
            a: {
              docs: 'Some cool statement across\n\nmultiple lines',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'a',
              code: true,
              pos: [27, 11, 1],
            },
            b: {
              docs: 'Some cool statement across\n\nmultiple lines',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'b',
              code: false,
              pos: [8, 0, 27],
            },
          },
          docs: '\n```idl\nmyPro, a,, $\n kw1 = Int, $\n\n```\n\nHeader\n\n#### Arguments\n\n- **a**: in, required, Int\n\n  Some cool statement across\n  \n  multiple lines\n\n\n#### Keywords\n\n- **kw1**: in, required, Int\n\n    Some cool statement across\n    \n    multiple lines\n\n\n### Author\n\nMeeeeeeeeeeeeeeeeeee',
          docsLookup: { default: 'Header', author: 'Meeeeeeeeeeeeeeeeeee' },
          display: 'myPro',
          kws: {
            kw1: {
              docs: 'Some cool statement across\n\nmultiple lines',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'kw1',
              code: true,
              pos: [27, 14, 3],
            },
            kw2: {
              docs: 'Some cool statement across\n\nmultiple lines',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'kw2',
              code: false,
              pos: [17, 0, 29],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { mypro: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
