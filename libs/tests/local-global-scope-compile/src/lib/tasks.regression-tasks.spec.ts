import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify type regression tests`, () => {
  it(`[auto generated] for task parsing bugs`, async () => {
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
      `compile_opt idl3`,
      `task1 = ENVITask('')`,
      `task2 = IDLTask('')`,
      `task3 = ENVITask("")`,
      `task4 = IDLTask("")`,
      `task5 = ENVITask(\`\`)`,
      `task6 = IDLTask(\`\`)`,
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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        task2: {
          type: 'v',
          name: 'task2',
          pos: [2, 0, 5],
          meta: {
            display: 'task2',
            isDefined: true,
            usage: [[2, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        task3: {
          type: 'v',
          name: 'task3',
          pos: [3, 0, 5],
          meta: {
            display: 'task3',
            isDefined: true,
            usage: [[3, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        task4: {
          type: 'v',
          name: 'task4',
          pos: [4, 0, 5],
          meta: {
            display: 'task4',
            isDefined: true,
            usage: [[4, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        task5: {
          type: 'v',
          name: 'task5',
          pos: [5, 0, 5],
          meta: {
            display: 'task5',
            isDefined: true,
            usage: [[5, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        task6: {
          type: 'v',
          name: 'task6',
          pos: [6, 0, 5],
          meta: {
            display: 'task6',
            isDefined: true,
            usage: [[6, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] no failures with syntax errors`, async () => {
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
    const code = [`compile_opt idl3`, `task1 = ENVITask('',`, `end`];

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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] no failures with syntax errors`, async () => {
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
    const code = [`compile_opt idl3`, `task1 = IDLTask('',`, `end`];

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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] no failures with syntax errors`, async () => {
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
    const code = [`compile_opt idl3`, `task1 = ENVITask("",`, `end`];

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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] no failures with syntax errors`, async () => {
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
    const code = [`compile_opt idl3`, `task1 = IDLTask("",`, `end`];

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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] no failures with syntax errors`, async () => {
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
    const code = [`compile_opt idl3`, `task1 = ENVITask(\`\`,`, `end`];

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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] no failures with syntax errors`, async () => {
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
    const code = [`compile_opt idl3`, `task1 = IDLTask(\`\`,`, `end`];

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
      pro: {},
      main: {
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
