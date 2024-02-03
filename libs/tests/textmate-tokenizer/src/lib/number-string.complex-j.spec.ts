import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates special cases for number string parsing`, () => {
  it(`[auto generated] verify octal parsing`, async () => {
    // test code to extract tokens from
    const code = [`"36j + "45j`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"36j',
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
        match: '"45j',
        startIndex: 7,
        endIndex: 11,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify octal parsing`, async () => {
    // test code to extract tokens from
    const code = [`"36bj + "45ullj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"36bj',
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
        match: '"45ullj',
        startIndex: 8,
        endIndex: 15,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote binary`, async () => {
    // test code to extract tokens from
    const code = [`'101010'bj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'101010'bj",
        startIndex: 0,
        endIndex: 10,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote hex`, async () => {
    // test code to extract tokens from
    const code = [`'10101'xj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'10101'xj",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quote octal`, async () => {
    // test code to extract tokens from
    const code = [`'10101'oj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'10101'oj",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote binary`, async () => {
    // test code to extract tokens from
    const code = [`"101010"bj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"101010"bj',
        startIndex: 0,
        endIndex: 10,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote hex`, async () => {
    // test code to extract tokens from
    const code = [`"10101"xj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"10101"xj',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quote octal`, async () => {
    // test code to extract tokens from
    const code = [`"10101"oj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"10101"oj',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify case as hex`, async () => {
    // test code to extract tokens from
    const code = [`'7FFF'XSj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'7FFF'XSj",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify case as hex`, async () => {
    // test code to extract tokens from
    const code = [`'8FFF'XSj`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'8FFF'XSj",
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
