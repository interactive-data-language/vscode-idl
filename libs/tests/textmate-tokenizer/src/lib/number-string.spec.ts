import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates special cases for number string parsing`, () => {
  it(`[auto generated] verify octal parsing`, async () => {
    // test code to extract tokens from
    const code = [`"36 + "45`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"36',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '"45',
        startIndex: 6,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify octal parsing`, async () => {
    // test code to extract tokens from
    const code = [`"36b + "45ull`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"36b',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '"45ull',
        startIndex: 7,
        endIndex: 13,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote binary`, async () => {
    // test code to extract tokens from
    const code = [`'101010'b`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'101010'b",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote hex`, async () => {
    // test code to extract tokens from
    const code = [`'10101'x`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'10101'x",
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote octal`, async () => {
    // test code to extract tokens from
    const code = [`'10101'o`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'10101'o",
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote binary`, async () => {
    // test code to extract tokens from
    const code = [`"101010"b`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"101010"b',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote hex`, async () => {
    // test code to extract tokens from
    const code = [`"10101"x`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"10101"x',
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote octal`, async () => {
    // test code to extract tokens from
    const code = [`"10101"o`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"10101"o',
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify case as hex`, async () => {
    // test code to extract tokens from
    const code = [`'7FFF'XS`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'7FFF'XS",
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify case as hex`, async () => {
    // test code to extract tokens from
    const code = [`'8FFF'XS`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'8FFF'XS",
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
