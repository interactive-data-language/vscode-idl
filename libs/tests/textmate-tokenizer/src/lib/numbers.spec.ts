import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates special cases for number parsing`, () => {
  it(`[auto generated] correctly parse scientific notations`, async () => {
    // test code to extract tokens from
    const code = [`a = -1e34`, `a = -1e34i`, `a = -1e34j`];

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
        match: '-',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '1e34',
        startIndex: 5,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '-',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1e34i',
        startIndex: 5,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '-',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '1e34j',
        startIndex: 5,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse scientific notations with negatives 1`, async () => {
    // test code to extract tokens from
    const code = [`a = 1e-34`, `a = 1e-34i`, `a = 1e-34j`];

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
        match: '1e-34',
        startIndex: 4,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1e-34i',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '1e-34j',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse scientific notations with negatives 2`, async () => {
    // test code to extract tokens from
    const code = [`a = 1e-`, `a = 1e-i`, `a = 1e-j`];

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
        match: '1e-',
        startIndex: 4,
        endIndex: 7,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1e-i',
        startIndex: 4,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '1e-j',
        startIndex: 4,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse hex notation`, async () => {
    // test code to extract tokens from
    const code = [
      `a = 0x8FFF + 0x8Fub + 0x8FulL`,
      `a = 0x8FFFI + 0x8FubI + 0x8FulLi`,
      `a = 0x8FFFJ + 0x8Fubj + 0x8FulLJ`,
    ];

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
        match: '0x8FFF',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '0x8Fub',
        startIndex: 13,
        endIndex: 19,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 20,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '0x8FulL',
        startIndex: 22,
        endIndex: 29,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0x8FFFI',
        startIndex: 4,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0x8FubI',
        startIndex: 14,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 22,
        endIndex: 23,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0x8FulLi',
        startIndex: 24,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0x8FFFJ',
        startIndex: 4,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: '+',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0x8Fubj',
        startIndex: 14,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: '+',
        startIndex: 22,
        endIndex: 23,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0x8FulLJ',
        startIndex: 24,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse octal notation`, async () => {
    // test code to extract tokens from
    const code = [
      `a = 0o8FFF + 0o8Fub + 0o8FulL`,
      `a = 0o8FFFI + 0o8FubI + 0o8FulLi`,
      `a = 0o8FFFJ + 0o8Fubj + 0o8FulLJ`,
    ];

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
        match: '0o8FFF',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '0o8Fub',
        startIndex: 13,
        endIndex: 19,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 20,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '0o8FulL',
        startIndex: 22,
        endIndex: 29,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0o8FFFI',
        startIndex: 4,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0o8FubI',
        startIndex: 14,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 22,
        endIndex: 23,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0o8FulLi',
        startIndex: 24,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0o8FFFJ',
        startIndex: 4,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: '+',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0o8Fubj',
        startIndex: 14,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: '+',
        startIndex: 22,
        endIndex: 23,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0o8FulLJ',
        startIndex: 24,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse binary notation`, async () => {
    // test code to extract tokens from
    const code = [
      `a = 0b8FFF + 0b8Fub + 0b8FulL`,
      `a = 0b8FFFI + 0b8FubI + 0b8FulLi`,
      `a = 0b8FFFJ + 0b8Fubj + 0b8FulLJ`,
    ];

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
        match: '0b8FFF',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '0b8Fub',
        startIndex: 13,
        endIndex: 19,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 20,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '0b8FulL',
        startIndex: 22,
        endIndex: 29,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0b8FFFI',
        startIndex: 4,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0b8FubI',
        startIndex: 14,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 22,
        endIndex: 23,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '0b8FulLi',
        startIndex: 24,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0b8FFFJ',
        startIndex: 4,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: '+',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0b8Fubj',
        startIndex: 14,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: '+',
        startIndex: 22,
        endIndex: 23,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '0b8FulLJ',
        startIndex: 24,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse scientific notations with doubles`, async () => {
    // test code to extract tokens from
    const code = [`a = -1d34`, `a = -1d34i`, `a = -1d34j`];

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
        match: '-',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '1d34',
        startIndex: 5,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '-',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1d34i',
        startIndex: 5,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '-',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '1d34j',
        startIndex: 5,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse scientific notations with doubles with negatives 1`, async () => {
    // test code to extract tokens from
    const code = [`a = 1d-34`, `a = 1d-34i`, `a = 1d-34j`];

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
        match: '1d-34',
        startIndex: 4,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1d-34i',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '1d-34j',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse scientific notations with doubles with negatives 2`, async () => {
    // test code to extract tokens from
    const code = [`a = 1d-`, `a = 1d-i`, `a = 1d-j`];

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
        match: '1d-',
        startIndex: 4,
        endIndex: 7,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1d-i',
        startIndex: 4,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: '1d-j',
        startIndex: 4,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parse new syntax for complex`, async () => {
    // test code to extract tokens from
    const code = [`a = 1i`, `a = 1j`];

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
        match: '1i',
        startIndex: 4,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '1j',
        startIndex: 4,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] catch unfinished dot statement 1`, async () => {
    // test code to extract tokens from
    const code = [`a.`];

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
        match: '.',
        startIndex: 1,
        endIndex: 3,
        scopes: ['source.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] catch unfinished dot statement 2`, async () => {
    // test code to extract tokens from
    const code = [`a = b.`];

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
        match: 'b',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] catch standalone dot`, async () => {
    // test code to extract tokens from
    const code = [`a = .`];

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
        match: '.',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] edge case scientific`, async () => {
    // test code to extract tokens from
    const code = [`a = .1e+12`];

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
        match: '.1e+12',
        startIndex: 4,
        endIndex: 10,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] solo dot`, async () => {
    // test code to extract tokens from
    const code = [`.`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '.',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
