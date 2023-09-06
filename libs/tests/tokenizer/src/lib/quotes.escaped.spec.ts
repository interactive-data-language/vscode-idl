import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates escaped quote parsing`, () => {
  it(`[auto generated] simple single quote`, () => {
    // test code to extract tokens from
    const code = [`'Resolve_Routine, ''%s'', Is_Function=%d'`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 0, 19],
        matches: [`'Resolve_Routine, '`, `Resolve_Routine, `],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 19, 4],
        matches: [`'%s'`, `%s`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 23, 18],
        matches: [`', Is_Function=%d'`, `, Is_Function=%d`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] simple double quote`, () => {
    // test code to extract tokens from
    const code = [`"Resolve_Routine, ""%s"", Is_Function=%d"`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 0, 19],
        matches: [`"Resolve_Routine, "`, `Resolve_Routine, `],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 19, 4],
        matches: [`"%s"`, `%s`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 23, 18],
        matches: [`", Is_Function=%d"`, `, Is_Function=%d`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] complex single quote`, () => {
    // test code to extract tokens from
    const code = [
      `'Resolve_Routine, ''%s'', Is_Function=%d''lots of''other''string'`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 0, 19],
        matches: [`'Resolve_Routine, '`, `Resolve_Routine, `],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 19, 4],
        matches: [`'%s'`, `%s`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 23, 18],
        matches: [`', Is_Function=%d'`, `, Is_Function=%d`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 41, 9],
        matches: [`'lots of'`, `lots of`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 50, 7],
        matches: [`'other'`, `other`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 57, 8],
        matches: [`'string'`, `string`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] complex double quote`, () => {
    // test code to extract tokens from
    const code = [
      `"Resolve_Routine, ""%s"", Is_Function=%d""lots of""other""string"`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 0, 19],
        matches: [`"Resolve_Routine, "`, `Resolve_Routine, `],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 19, 4],
        matches: [`"%s"`, `%s`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 23, 18],
        matches: [`", Is_Function=%d"`, `, Is_Function=%d`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 41, 9],
        matches: [`"lots of"`, `lots of`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 50, 7],
        matches: [`"other"`, `other`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 57, 8],
        matches: [`"string"`, `string`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
