import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates special cases for number string parsing`, () => {
  it(`[auto generated] verify octal parsing`, () => {
    // test code to extract tokens from
    const code = [`"36 + "45`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 3],
        matches: [`"36`, `36`, ``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 4, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 6, 3],
        matches: [`"45`, `45`, ``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 9, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify octal parsing`, () => {
    // test code to extract tokens from
    const code = [`"36b + "45ull`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 4],
        matches: [`"36b`, `36`, `b`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 5, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 7, 6],
        matches: [`"45ull`, `45`, `ull`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 13, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify single quote binary`, () => {
    // test code to extract tokens from
    const code = [`'101010'b`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 9],
        matches: [`'101010'b`, `101010`, `b`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify single quote hex`, () => {
    // test code to extract tokens from
    const code = [`'10101'x`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 8],
        matches: [`'10101'x`, `10101`, `x`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify single quote octal`, () => {
    // test code to extract tokens from
    const code = [`'10101'o`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 8],
        matches: [`'10101'o`, `10101`, `o`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify double quote binary`, () => {
    // test code to extract tokens from
    const code = [`"101010"b`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 9],
        matches: [`"101010"b`, `101010`, `b`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify double quote hex`, () => {
    // test code to extract tokens from
    const code = [`"10101"x`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 8],
        matches: [`"10101"x`, `10101`, `x`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify double quote octal`, () => {
    // test code to extract tokens from
    const code = [`"10101"o`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 8],
        matches: [`"10101"o`, `10101`, `o`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify case as hex`, () => {
    // test code to extract tokens from
    const code = [`'7FFF'XS`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 8],
        matches: [`'7FFF'XS`, `7FFF`, `XS`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify case as hex`, () => {
    // test code to extract tokens from
    const code = [`'8FFF'XS`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 0, 8],
        matches: [`'8FFF'XS`, `8FFF`, `XS`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
