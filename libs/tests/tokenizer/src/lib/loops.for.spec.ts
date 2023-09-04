import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates for loop parsing`, () => {
  it(`[auto generated] parses basic for loop`, () => {
    // test code to extract tokens from
    const code = [`for i=0, 99 do print, i`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 0, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 6, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 7, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 9, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 12, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 15, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 20, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 22, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 23, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 23, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 23, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic for loop with increment`, () => {
    // test code to extract tokens from
    const code = [`for i=0, 99, 2 do !null = myFunc(i)`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 0, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 6, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 7, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 9, 2],
        matches: [`99`],
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
        pos: [0, 13, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 15, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 18, 5],
        matches: [`!null`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 24, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 26, 7],
        matches: [`myFunc(`, `myFunc`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 33, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 34, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 35, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 35, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 35, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic for loop with line continuation`, () => {
    // test code to extract tokens from
    const code = [`for i=0, jj do $`, `  print, i`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 0, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 6, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 7, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 9, 2],
        matches: [`jj`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 12, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 15, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 16, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [1, 2, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 7, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 9, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [1, 10, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [1, 10, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [1, 10, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic for loop with block`, () => {
    // test code to extract tokens from
    const code = [`for i=0, 99 do begin`, `  !null = myFunc(i)`, `endfor`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 0, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 6, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 7, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 9, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 12, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [0, 15, 5],
        matches: [`begin`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [1, 2, 5],
        matches: [`!null`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 8, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [1, 10, 7],
        matches: [`myFunc(`, `myFunc`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 17, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [1, 18, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [2, 0, 6],
        matches: [`endfor`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [2, 6, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [2, 6, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses nested for loop`, () => {
    // test code to extract tokens from
    const code = [`for i=0, 99 do for j=0, 99 do print, i + j`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 0, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 6, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 7, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 9, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 12, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 15, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 19, 1],
        matches: [`j`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 20, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 21, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 22, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 22, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 24, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 27, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 30, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 35, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 37, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 39, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 41, 1],
        matches: [`j`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 42, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
