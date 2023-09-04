import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates bracket parsing`, () => {
  it(`[auto generated] parses standalone brackets`, () => {
    // test code to extract tokens from
    const code = [`[1 + 2]`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 0, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 1, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 3, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 5, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 6, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 6, 1],
        matches: [`]`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses standalone brackets with line continuations`, () => {
    // test code to extract tokens from
    const code = [`[1 + $`, `  2]`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 0, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 1, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 3, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 5, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 6, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [1, 2, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [1, 3, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [1, 3, 1],
        matches: [`]`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] indexing and compound expression`, () => {
    // test code to extract tokens from
    const code = [`array1[1 + 2] * (1 + 2)`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 6],
        matches: [`array1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 6, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 7, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 9, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 11, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 12, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 12, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 14, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 16, 1],
        matches: [`(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 17, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 19, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 21, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 22, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 22, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 23, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] brackets with assignment`, () => {
    // test code to extract tokens from
    const code = [`_a[i] = 5 * b`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 2],
        matches: [`_a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 2, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 3, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 4, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 6, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 8, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 10, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 12, 1],
        matches: [`b`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 13, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 13, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] brackets with compound assignment`, () => {
    // test code to extract tokens from
    const code = [`_aA$[i] *= b`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_aA$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 4, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 5, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 6, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 8, 2],
        matches: [`*=`, `*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 11, 1],
        matches: [`b`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 12, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
