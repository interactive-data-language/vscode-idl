import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates unknown token parsing`, () => {
  it(`[auto generated] improper arrow function`, async () => {
    // test code to extract tokens from
    const code = [`sEvent.component-> $`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'sEvent',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: 'component',
        startIndex: 7,
        endIndex: 16,
        scopes: ['source.idl', 'entity.other.attribute-name.idl'],
      },
      {
        line: 0,
        match: '-> ',
        startIndex: 16,
        endIndex: 19,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] text after comment`, async () => {
    // test code to extract tokens from
    const code = [`a = $ bad bad`];

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
        match: '$',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: ' bad bad',
        startIndex: 5,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] unknown has right positioning with zero-width matches`, async () => {
    // test code to extract tokens from
    const code = [`scale=scale, $, $`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'scale',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'scale',
        startIndex: 6,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: ', $',
        startIndex: 14,
        endIndex: 17,
        scopes: ['source.idl', 'group.line-continuation.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
