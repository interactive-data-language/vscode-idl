import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates routine parsing`, () => {
  it(`[auto generated] verifies we only stop on "end"`, () => {
    // test code to extract tokens from
    const code = [`PRO EndMagic, Unit, Id`, `  PRINTF, Unit`, `END`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_PROCEDURE,
        pos: [0, 0, 4],
        matches: [`PRO `, `PRO`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_NAME,
        pos: [0, 4, 8],
        matches: [`EndMagic`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 12, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 14, 4],
        matches: [`Unit`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 18, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 20, 2],
        matches: [`Id`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_NAME,
        pos: [0, 22, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [1, 2, 6],
        matches: [`PRINTF`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 8, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 10, 4],
        matches: [`Unit`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [1, 14, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_PROCEDURE,
        pos: [2, 0, 3],
        matches: [`END`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies we parse names with "!"`, () => {
    // test code to extract tokens from
    const code = [`pro !sosobad,`, `END`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_PROCEDURE,
        pos: [0, 0, 4],
        matches: [`pro `, `pro`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_NAME,
        pos: [0, 4, 8],
        matches: [`!sosobad`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 12, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_NAME,
        pos: [0, 13, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_PROCEDURE,
        pos: [1, 0, 3],
        matches: [`END`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies we parse method names with "!"`, () => {
    // test code to extract tokens from
    const code = [`pro !sosobad::method,`, `END`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_PROCEDURE,
        pos: [0, 0, 4],
        matches: [`pro `, `pro`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_METHOD_NAME,
        pos: [0, 4, 16],
        matches: [`!sosobad::method`, `!sosobad`, `method`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 20, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_METHOD_NAME,
        pos: [0, 21, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_PROCEDURE,
        pos: [1, 0, 3],
        matches: [`END`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] routines in a very bad single-line`, () => {
    // test code to extract tokens from
    const code = [`FUNCTION VarName, Ptr & RETURN,'' & END`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_FUNCTION,
        pos: [0, 0, 9],
        matches: [`FUNCTION `, `FUNCTION`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_NAME,
        pos: [0, 9, 7],
        matches: [`VarName`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 16, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 18, 3],
        matches: [`Ptr`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_NAME,
        pos: [0, 22, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 22, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 24, 6],
        matches: [`RETURN`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 30, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 31, 2],
        matches: [`''`, ``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 34, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 34, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 34, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 36, 0],
        matches: [``, `END`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_FUNCTION,
        pos: [0, 36, 3],
        matches: [`END`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
