import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates special cases for number string parsing`, () => {
  it(`[auto generated] verify octal parsing`, async () => {
    // test code to extract tokens from
    const code = [`"36i + "45i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"36i',
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
        match: '"45i',
        startIndex: 7,
        endIndex: 11,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify octal parsing`, async () => {
    // test code to extract tokens from
    const code = [`"36bi + "45ulli`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"36bi',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '"45ulli',
        startIndex: 8,
        endIndex: 15,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote binary`, async () => {
    // test code to extract tokens from
    const code = [`'101010'bi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'101010'bi",
        startIndex: 0,
        endIndex: 10,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote hex`, async () => {
    // test code to extract tokens from
    const code = [`'10101'xi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'10101'xi",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote octal`, async () => {
    // test code to extract tokens from
    const code = [`'10101'oi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'10101'oi",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote binary`, async () => {
    // test code to extract tokens from
    const code = [`"101010"bi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"101010"bi',
        startIndex: 0,
        endIndex: 10,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote hex`, async () => {
    // test code to extract tokens from
    const code = [`"10101"xi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"10101"xi',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote octal`, async () => {
    // test code to extract tokens from
    const code = [`"10101"oi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"10101"oi',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify case as hex`, async () => {
    // test code to extract tokens from
    const code = [`'7FFF'XSi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'7FFF'XSi",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify case as hex`, async () => {
    // test code to extract tokens from
    const code = [`'8FFF'XSi`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'8FFF'XSi",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
