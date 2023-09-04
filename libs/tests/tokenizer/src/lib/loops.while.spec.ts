import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates while loop parsing`, () => {
  it(`[auto generated] parses basic while loop`, () => {
    // test code to extract tokens from
    const code = [`while !true do print, i`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 0, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 6, 5],
        matches: [`!true`],
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
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 23, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic nested while loop`, () => {
    // test code to extract tokens from
    const code = [`while !true do while !false do print, i`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 0, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 6, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 12, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 15, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 21, 6],
        matches: [`!false`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 28, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 31, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 36, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 38, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 39, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 39, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 39, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 39, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 39, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic while loop with line continuation`, () => {
    // test code to extract tokens from
    const code = [`while !true do $`, `  print,  $`, `  i`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 0, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 6, 5],
        matches: [`!true`],
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
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 10, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 11, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 2, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [2, 3, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [2, 3, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [2, 3, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses basic while loop with block`, () => {
    // test code to extract tokens from
    const code = [`while (a eq 5) do begin`, `  !null = myFunc(i)`, `endwhile`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 0, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 6, 1],
        matches: [`(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 9, 2],
        matches: [`eq`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 12, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 13, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 13, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 15, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [0, 18, 5],
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
        pos: [2, 0, 8],
        matches: [`endwhile`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [2, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [2, 8, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
