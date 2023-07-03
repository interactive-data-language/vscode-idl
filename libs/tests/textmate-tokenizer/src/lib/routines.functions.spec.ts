import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates function parsing`, () => {
  it(`[auto generated] parses standalone functions`, async () => {
    // test code to extract tokens from
    const code = [`myFunc(1 + 2)`];

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
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 9,
        endIndex: 10,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
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

  it(`[auto generated] parses nested functions`, async () => {
    // test code to extract tokens from
    const code = [`myFunc(myFunc2(_y7$) + 2)`];

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
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: 'myFunc2',
        startIndex: 7,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '_y7$',
        startIndex: 15,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 21,
        endIndex: 22,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 23,
        endIndex: 24,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 24,
        endIndex: 25,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] separate function from parentheses`, async () => {
    // test code to extract tokens from
    const code = [`myFunc(1 + 2) * (1 + 2)`];

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
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 9,
        endIndex: 10,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: '*',
        startIndex: 14,
        endIndex: 15,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '(',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses standalone functions with line continuations`, async () => {
    // test code to extract tokens from
    const code = [`myFunc(1 $`, `  + 2)`];

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
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '+',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '2',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: ')',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] single-character function`, async () => {
    // test code to extract tokens from
    const code = [`a()`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
