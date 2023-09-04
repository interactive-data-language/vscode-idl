import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates repeat loop parsing`, () => {
  it(`[auto generated] parses basic repeat loop`, () => {
    // test code to extract tokens from
    const code = [`REPEAT A = A * 2 UNTIL A GT B`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`REPEAT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 9, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 11, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 13, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 15, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 17, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 17, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 17, 5],
        matches: [`UNTIL`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 23, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 25, 2],
        matches: [`GT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 28, 1],
        matches: [`B`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 29, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 29, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 29, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses procedure in repeat loop`, () => {
    // test code to extract tokens from
    const code = [`REPEAT PRINT, A UNTIL A GT B`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`REPEAT`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 7, 5],
        matches: [`PRINT`],
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
        pos: [0, 14, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 16, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 16, 5],
        matches: [`UNTIL`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 22, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 24, 2],
        matches: [`GT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 27, 1],
        matches: [`B`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 28, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic repeat loop with line continuations`, () => {
    // test code to extract tokens from
    const code = [`REPEAT A = $`, `  A * 2 UNTIL $`, `  A GT B`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`REPEAT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 9, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 11, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 12, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 2, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [1, 4, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [1, 6, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [1, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [1, 8, 5],
        matches: [`UNTIL`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 14, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 2, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [2, 4, 2],
        matches: [`GT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 7, 1],
        matches: [`B`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [2, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [2, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [2, 8, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic repeat loop with block`, () => {
    // test code to extract tokens from
    const code = [`REPEAT BEGIN`, `  A = A * 2`, `ENDREP UNTIL A GT B`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`REPEAT`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [0, 7, 5],
        matches: [`BEGIN`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 2, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 4, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 6, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [1, 8, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [1, 10, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [1, 11, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 11, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [2, 0, 6],
        matches: [`ENDREP`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [2, 7, 5],
        matches: [`UNTIL`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 13, 1],
        matches: [`A`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [2, 15, 2],
        matches: [`GT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 18, 1],
        matches: [`B`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [2, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [2, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [2, 19, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] correctly parses loops with if statements inside`, () => {
    // test code to extract tokens from
    const code = [`repeat if !true then break until !true`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`repeat`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 7, 2],
        matches: [`if`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 10, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 16, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_BREAK,
        pos: [0, 21, 5],
        matches: [`break`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 27, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 27, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 27, 5],
        matches: [`until`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 33, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 38, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 38, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
