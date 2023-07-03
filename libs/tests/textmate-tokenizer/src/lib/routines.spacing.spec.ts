import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates routine spacing`, () => {
  it(`[auto generated] functions`, async () => {
    // test code to extract tokens from
    const code = [`myFunc    (1 + 2)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myFunc',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 13,
        endIndex: 14,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 15,
        endIndex: 16,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 16,
        endIndex: 17,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedures`, async () => {
    // test code to extract tokens from
    const code = [`mypro   ,`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'mypro',
        startIndex: 0,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] function method (dots)`, async () => {
    // test code to extract tokens from
    const code = [`a . method ()`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] function method (arrow)`, async () => {
    // test code to extract tokens from
    const code = [`a -> method ()`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: ' -> ',
        startIndex: 1,
        endIndex: 5,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 5,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 13,
        endIndex: 14,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedure method 1 (dots)`, async () => {
    // test code to extract tokens from
    const code = [`a . method `];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedure method 2 (dots)`, async () => {
    // test code to extract tokens from
    const code = [`a . method , `];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedure method 1 (arrow)`, async () => {
    // test code to extract tokens from
    const code = [`a -> method `];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '->',
        startIndex: 2,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 5,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedure method 2 (arrow)`, async () => {
    // test code to extract tokens from
    const code = [`a -> method , `];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '->',
        startIndex: 2,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 5,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
