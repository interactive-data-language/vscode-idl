import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates compound operator parsing`, () => {
  it(`[auto generated] parses with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`z *= $`, `  5`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'z',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '*=',
        startIndex: 2,
        endIndex: 4,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '5',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] does not recurse with "||" operator`, async () => {
    // test code to extract tokens from
    const code = [`a || b || c`];

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
        match: '||',
        startIndex: 2,
        endIndex: 4,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '||',
        startIndex: 7,
        endIndex: 9,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'c',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] does not recurse with "or" operator`, async () => {
    // test code to extract tokens from
    const code = [`a or b or c`];

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
        match: 'or',
        startIndex: 2,
        endIndex: 4,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: 'or',
        startIndex: 7,
        endIndex: 9,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'c',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] captures all statements with "&&" operator`, async () => {
    // test code to extract tokens from
    const code = [`a && b && c`];

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
        match: '&&',
        startIndex: 2,
        endIndex: 4,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '&&',
        startIndex: 7,
        endIndex: 9,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'c',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] captures all statements with "&&" operator`, async () => {
    // test code to extract tokens from
    const code = [`a and b and c`];

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
        match: 'and',
        startIndex: 2,
        endIndex: 5,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: 'and',
        startIndex: 8,
        endIndex: 11,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'c',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
