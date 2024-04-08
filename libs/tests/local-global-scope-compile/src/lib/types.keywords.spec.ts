import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] output or bidirectional keywords`, async () => {
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
      `; :Description:`,
      `;   Constructor`,
      `;`,
      `; :Returns:`,
      `;   myclass`,
      `;`,
      `;-`,
      `function myclass::Init`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Keywords:`,
      `;   kw: out, optional, Array<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function myclass::method, kw = kw`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   kw: out, optional, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro myclass::method, kw = kw`,
      `  compile_opt idl2`,
      `end`,
      ``,
      `;+`,
      `; :Description:`,
      `;   Class definition procedure`,
      `;`,
      `;-`,
      `pro myclass__define`,
      `  compile_opt idl2`,
      ``,
      `  struct = {myclass}`,
      `end`,
      ``,
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Keywords:`,
      `;   kw: out, optional, Long`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function myfunc, kw = kw`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   kw: out, optional, Byte`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro mypro, kw = kw`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `; main level program`,
      `compile_opt idl2`,
      ``,
      `; procedures`,
      `mypro, kw = a`,
      ``,
      `; functions`,
      `!null = myfunc(kw = b)`,
      ``,
      `; make class for methods`,
      `var = myclass()`,
      ``,
      `; procedure methods`,
      `var.method, kw = c`,
      ``,
      `; function methods`,
      `!null = var.method(kw = d)`,
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
        myfunc: {
          kw: {
            type: 'v',
            name: 'kw',
            pos: [58, 22, 2],
            meta: {
              display: 'kw',
              isDefined: true,
              usage: [[58, 22, 2]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
            },
          },
        },
        'myclass::method': {
          kw: {
            type: 'v',
            name: 'kw',
            pos: [23, 31, 2],
            meta: {
              display: 'kw',
              isDefined: true,
              usage: [[23, 31, 2]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [23, 9, 15],
            meta: {
              display: 'self',
              isDefined: true,
              docs: 'A reference to our object class',
              source: 'user',
              type: [
                { name: 'myclass', display: 'myclass', args: [], meta: {} },
              ],
              usage: [],
            },
          },
        },
        'myclass::init': {
          self: {
            type: 'v',
            name: 'self',
            pos: [8, 9, 13],
            meta: {
              display: 'self',
              isDefined: true,
              docs: 'A reference to our object class',
              source: 'user',
              type: [
                { name: 'myclass', display: 'myclass', args: [], meta: {} },
              ],
              usage: [],
            },
          },
        },
      },
      pro: {
        mypro: {
          kw: {
            type: 'v',
            name: 'kw',
            pos: [69, 16, 2],
            meta: {
              display: 'kw',
              isDefined: true,
              usage: [[69, 16, 2]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
            },
          },
        },
        myclass__define: {
          struct: {
            type: 'v',
            name: 'struct',
            pos: [46, 2, 6],
            meta: {
              display: 'struct',
              isDefined: true,
              usage: [[46, 2, 6]],
              docs: '',
              source: 'user',
              type: [
                { name: 'myclass', display: 'myclass', args: [], meta: {} },
              ],
            },
          },
        },
        'myclass::method': {
          kw: {
            type: 'v',
            name: 'kw',
            pos: [34, 26, 2],
            meta: {
              display: 'kw',
              isDefined: true,
              usage: [[34, 26, 2]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [34, 4, 15],
            meta: {
              display: 'self',
              isDefined: true,
              docs: 'A reference to our object class',
              source: 'user',
              type: [
                { name: 'myclass', display: 'myclass', args: [], meta: {} },
              ],
              usage: [],
            },
          },
        },
      },
      main: {
        a: {
          type: 'v',
          name: 'a',
          pos: [78, 12, 1],
          meta: {
            display: 'a',
            isDefined: true,
            usage: [[78, 12, 1]],
            docs: '',
            source: 'user',
            type: [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
          },
        },
        b: {
          type: 'v',
          name: 'b',
          pos: [81, 20, 1],
          meta: {
            display: 'b',
            isDefined: true,
            usage: [[81, 20, 1]],
            docs: '',
            source: 'user',
            type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
          },
        },
        var: {
          type: 'v',
          name: 'var',
          pos: [84, 0, 3],
          meta: {
            display: 'var',
            isDefined: true,
            usage: [
              [84, 0, 3],
              [87, 0, 3],
              [90, 8, 3],
            ],
            docs: '',
            source: 'user',
            type: [{ name: 'myclass', display: 'myclass', args: [], meta: {} }],
          },
        },
        c: {
          type: 'v',
          name: 'c',
          pos: [87, 17, 1],
          meta: {
            display: 'c',
            isDefined: true,
            usage: [[87, 17, 1]],
            docs: '',
            source: 'user',
            type: [
              { name: 'ENVIRaster', display: 'ENVIRaster', args: [], meta: {} },
            ],
          },
        },
        d: {
          type: 'v',
          name: 'd',
          pos: [90, 24, 1],
          meta: {
            display: 'd',
            isDefined: true,
            usage: [[90, 24, 1]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<Number>',
                args: [
                  [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                ],
                meta: {},
              },
            ],
          },
        },
      },
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: '$main$',
        pos: [74, 0, 20],
        meta: {
          display: '$main$',
          docs: 'Main level program',
          docsLookup: {},
          args: {},
          kws: {},
          source: 'user',
          struct: [],
        },
      },
      {
        type: 'p',
        name: 'mypro',
        pos: [69, 4, 5],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmypro, $\n  kw = value\n```\n\n\n\n\n#### Keywords\n\n- **kw**: out, optional, Byte\n\n    Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'mypro',
          kws: {
            kw: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'out',
              source: 'internal',
              type: [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'kw',
              code: true,
              pos: [69, 11, 2],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'myfunc',
        pos: [58, 9, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = myfunc( $\n  kw = value)\n```\n\n\n\n\n#### Keywords\n\n- **kw**: out, optional, Long\n\n    Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '', returns: 'any' },
          display: 'myfunc',
          kws: {
            kw: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'out',
              source: 'internal',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'kw',
              code: true,
              pos: [58, 17, 2],
            },
          },
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'p',
        name: 'myclass__define',
        pos: [43, 4, 15],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmyclass__define\n```\n\nClass definition procedure\n',
          docsLookup: { default: 'Class definition procedure' },
          display: 'myclass__define',
          kws: {},
          private: false,
          struct: [
            {
              type: 's',
              name: 'myclass',
              pos: [46, 12, 7],
              meta: {
                display: 'myclass',
                inherits: [],
                docs: '',
                props: {},
                source: 'user',
              },
            },
          ],
        },
        file: 'not-real',
      },
      {
        type: 's',
        name: 'myclass',
        pos: [46, 12, 7],
        meta: {
          display: 'myclass',
          inherits: [],
          docs: '',
          props: {},
          source: 'user',
          private: false,
        },
        file: 'not-real',
      },
      {
        type: 'pm',
        name: 'myclass::method',
        pos: [34, 4, 15],
        meta: {
          className: 'myclass',
          method: 'method',
          source: 'user',
          args: {},
          docs: '\n```idl\nmyclass.method, $\n  kw = value\n```\n\n\n\n\n#### Keywords\n\n- **kw**: out, optional, ENVIRaster\n\n    Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'myclass::method',
          kws: {
            kw: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'out',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'kw',
              code: true,
              pos: [34, 21, 2],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'fm',
        name: 'myclass::method',
        pos: [23, 9, 15],
        meta: {
          className: 'myclass',
          method: 'method',
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = myclass.method( $\n  kw = value)\n```\n\n\n\n\n#### Keywords\n\n- **kw**: out, optional, Array<Number>\n\n    Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '', returns: 'any' },
          display: 'myclass::method',
          kws: {
            kw: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'out',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'kw',
              code: true,
              pos: [23, 26, 2],
            },
          },
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'fm',
        name: 'myclass::init',
        pos: [8, 9, 13],
        meta: {
          className: 'myclass',
          method: 'init',
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: myclass\n;+\nresult = myclass()\n```\n\nConstructor\n',
          docsLookup: { default: 'Constructor', returns: 'myclass' },
          display: 'myclass::Init',
          kws: {},
          private: false,
          returns: [
            { name: 'myclass', display: 'myclass', args: [], meta: {} },
          ],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'myclass',
        pos: [8, 9, 13],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: myclass\n;+\nresult = myclass()\n```\n\nConstructor\n',
          docsLookup: { default: 'Constructor', returns: 'myclass' },
          display: 'myclass',
          kws: {},
          private: false,
          returns: [
            { name: 'myclass', display: 'myclass', args: [], meta: {} },
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
        myfunc: ['idl2'],
        'myclass::method': ['idl2'],
        'myclass::init': ['idl2'],
      },
      pro: {
        mypro: ['idl2'],
        myclass__define: ['idl2'],
        'myclass::method': ['idl2'],
      },
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
