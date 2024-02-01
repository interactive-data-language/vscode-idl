import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates comma parsing (mostly covered elsewhere)`, () => {
  it(`[auto generated] don't find commas on their own`, async () => {
    // test code to extract tokens from
    const code = [`,`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: ',',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] find commas in function`, async () => {
    // test code to extract tokens from
    const code = [`f(,)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'f',
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
        match: ',',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] find commas in pro`, async () => {
    // test code to extract tokens from
    const code = [`p,`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'p',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
