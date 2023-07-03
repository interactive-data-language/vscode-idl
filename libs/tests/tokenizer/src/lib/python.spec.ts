import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates Python code parsing`, () => {
  it(`[auto generated] parses IDL prompt`, () => {
    // test code to extract tokens from
    const code = [`>>>import numpy as np`];

    // extract tokens
    const tokenized = Tokenizer(code);

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.PYTHON,
        pos: [0, 0, 21],
        matches: [`>>>import numpy as np`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
