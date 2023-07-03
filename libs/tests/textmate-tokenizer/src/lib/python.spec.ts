import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates Python code parsing`, () => {
  it(`[auto generated] parses IDL prompt`, async () => {
    // test code to extract tokens from
    const code = [`>>>import numpy as np`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '>',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '>',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '>',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'import',
        startIndex: 3,
        endIndex: 9,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: 'numpy',
        startIndex: 10,
        endIndex: 15,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: 'as',
        startIndex: 16,
        endIndex: 18,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: 'np',
        startIndex: 19,
        endIndex: 21,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
