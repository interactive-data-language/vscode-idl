import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates colon parsing`, () => {
  it(`[auto generated] simple colon test`, async () => {
    // test code to extract tokens from
    const code = [`[:]`];

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
        match: ':',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl', 'group.brackets.square.idl'],
      },
      {
        line: 0,
        match: ']',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] array indexing`, async () => {
    // test code to extract tokens from
    const code = [`a[0:I] = 42`];

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
        match: '[',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '0',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.brackets.square.idl'],
      },
      {
        line: 0,
        match: 'I',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '42',
        startIndex: 9,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
