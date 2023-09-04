import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates parentheses parsing`, () => {
  it(`[auto generated] parses standalone parentheses`, () => {
    // test code to extract tokens from
    const code = [`(1 + 2)`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 0, 1],
        matches: [`(`],
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
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 6, 1],
        matches: [`)`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] separate function from parentheses`, () => {
    // test code to extract tokens from
    const code = [`myFunc(1 + 2) * (1 + 2)`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 0, 7],
        matches: [`myFunc(`, `myFunc`],
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
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 12, 1],
        matches: [`)`],
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

  it(`[auto generated] parses standalone parentheses with line continuation`, () => {
    // test code to extract tokens from
    const code = [`(1 + $ `, `  2)`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 0, 1],
        matches: [`(`],
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
        pos: [0, 7, 0],
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
        name: TOKEN_NAMES.PARENTHESES,
        pos: [1, 3, 1],
        matches: [`)`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
