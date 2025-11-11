import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates edge case quote parsing`, () => {
  it(`[auto generated] for number-string like strings`, async () => {
    // test code to extract tokens from
    const code = [`a = "5"`];

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
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] for complex quotes confused with number strings`, async () => {
    // test code to extract tokens from
    const code = [`c = "1:5,000,000 GNC Charts (754m)"`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'c',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '1:5,000,000 GNC Charts (754m)',
        startIndex: 5,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 34,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
