import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates prompt parsing`, () => {
  it(`[auto generated] parses IDL prompt`, () => {
    // test code to extract tokens from
    const code = [`IDL> print, 42`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.PROMPT,
        pos: [0, 0, 4],
        matches: [`IDL>`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 5, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 10, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 12, 2],
        matches: [`42`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 14, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses ENVI prompt`, () => {
    // test code to extract tokens from
    const code = [`ENVI> print, 17`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.PROMPT,
        pos: [0, 0, 5],
        matches: [`ENVI>`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 6, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 11, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 13, 2],
        matches: [`17`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 15, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
