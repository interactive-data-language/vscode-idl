import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates bracket parsing`, () => {
  it(`[auto generated] parses standalone brackets`, async () => {
    // test code to extract tokens from
    const code = [`[1 + 2]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '[',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses standalone brackets with line continuations`, async () => {
    // test code to extract tokens from
    const code = [`[1 + $`, `  2]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '[',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '2',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 1,
        match: ']',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] indexing and compound expression`, async () => {
    // test code to extract tokens from
    const code = [`array1[1 + 2] * (1 + 2)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'array1',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '[',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
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

  it(`[auto generated] brackets with assignment`, async () => {
    // test code to extract tokens from
    const code = [`_a[i] = 5 * b`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_a',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '[',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '*',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] brackets with compound assignment`, async () => {
    // test code to extract tokens from
    const code = [`_aA$[i] *= b`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_aA$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '[',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '*=',
        startIndex: 8,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
