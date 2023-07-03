import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates escaped quote parsing`, () => {
  it(`[auto generated] simple single quote`, async () => {
    // test code to extract tokens from
    const code = [`'Resolve_Routine, ''%s'', Is_Function=%d'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'",
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: 'Resolve_Routine, ',
        startIndex: 1,
        endIndex: 18,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: '%s',
        startIndex: 20,
        endIndex: 22,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 22,
        endIndex: 24,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ', Is_Function=%d',
        startIndex: 24,
        endIndex: 40,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 40,
        endIndex: 41,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] simple double quote`, async () => {
    // test code to extract tokens from
    const code = [`"Resolve_Routine, ""%s"", Is_Function=%d"`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: 'Resolve_Routine, ',
        startIndex: 1,
        endIndex: 18,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: '%s',
        startIndex: 20,
        endIndex: 22,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 22,
        endIndex: 24,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ', Is_Function=%d',
        startIndex: 24,
        endIndex: 40,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 40,
        endIndex: 41,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] complex single quote`, async () => {
    // test code to extract tokens from
    const code = [
      `'Resolve_Routine, ''%s'', Is_Function=%d''lots of''other''string'`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'",
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: 'Resolve_Routine, ',
        startIndex: 1,
        endIndex: 18,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: '%s',
        startIndex: 20,
        endIndex: 22,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 22,
        endIndex: 24,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ', Is_Function=%d',
        startIndex: 24,
        endIndex: 40,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 40,
        endIndex: 42,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: 'lots of',
        startIndex: 42,
        endIndex: 49,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 49,
        endIndex: 51,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: 'other',
        startIndex: 51,
        endIndex: 56,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "''",
        startIndex: 56,
        endIndex: 58,
        scopes: [
          'source.idl',
          'string.quoted.single.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: 'string',
        startIndex: 58,
        endIndex: 64,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 64,
        endIndex: 65,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] complex double quote`, async () => {
    // test code to extract tokens from
    const code = [
      `"Resolve_Routine, ""%s"", Is_Function=%d""lots of""other""string"`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: 'Resolve_Routine, ',
        startIndex: 1,
        endIndex: 18,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: '%s',
        startIndex: 20,
        endIndex: 22,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 22,
        endIndex: 24,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ', Is_Function=%d',
        startIndex: 24,
        endIndex: 40,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 40,
        endIndex: 42,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: 'lots of',
        startIndex: 42,
        endIndex: 49,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 49,
        endIndex: 51,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: 'other',
        startIndex: 51,
        endIndex: 56,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '""',
        startIndex: 56,
        endIndex: 58,
        scopes: [
          'source.idl',
          'string.quoted.double.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: 'string',
        startIndex: 58,
        endIndex: 64,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 64,
        endIndex: 65,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
