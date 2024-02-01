import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates prompt parsing`, () => {
  it(`[auto generated] parses IDL prompt`, async () => {
    // test code to extract tokens from
    const code = [`IDL> print, 42`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'IDL>',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.prompt.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 5,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.prompt.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.prompt.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '42',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.prompt.idl',
          'group.call.pro.idl',
          'constant.numeric.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses ENVI prompt`, async () => {
    // test code to extract tokens from
    const code = [`ENVI> print, 17`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'ENVI>',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'group.prompt.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 6,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.prompt.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.prompt.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '17',
        startIndex: 13,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.prompt.idl',
          'group.call.pro.idl',
          'constant.numeric.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
