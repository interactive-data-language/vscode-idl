import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates for ternary statement parsing`, () => {
  it(`[auto generated] simplest ternary statement`, () => {
    // test code to extract tokens from
    const code = [`a = something ? 5 : 6`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 9],
        matches: [`something`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 14, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 16, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 18, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 20, 1],
        matches: [`6`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 21, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 21, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 21, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] nested ternary statement grouped`, () => {
    // test code to extract tokens from
    const code = [`a = !true ? (!false ? 7 : 8) : 6`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 4, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 10, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 12, 1],
        matches: [`(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 13, 6],
        matches: [`!false`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 20, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 22, 1],
        matches: [`7`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 24, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 26, 1],
        matches: [`8`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 27, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 27, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [0, 27, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 29, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 31, 1],
        matches: [`6`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 32, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 32, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 32, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] nested ternary statement without grouping`, () => {
    // test code to extract tokens from
    const code = [`mypro, something ? ~something ? 7 : 8 : 6, 2`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 0, 5],
        matches: [`mypro`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 5, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 9],
        matches: [`something`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 17, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 19, 1],
        matches: [`~`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 20, 9],
        matches: [`something`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 30, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 32, 1],
        matches: [`7`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 34, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 36, 1],
        matches: [`8`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 38, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 38, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 38, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 40, 1],
        matches: [`6`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 41, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 41, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 41, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 43, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 44, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] ternary as argument`, () => {
    // test code to extract tokens from
    const code = [`a = myfunc(something ? otherfunc() : !awesomesauce) + 3`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 4, 7],
        matches: [`myfunc(`, `myfunc`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 11, 9],
        matches: [`something`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 21, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 23, 10],
        matches: [`otherfunc(`, `otherfunc`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 33, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 35, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 37, 13],
        matches: [`!awesomesauce`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 50, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 50, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 50, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 52, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 54, 1],
        matches: [`3`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 55, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 55, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] operators end on ternary statements`, () => {
    // test code to extract tokens from
    const code = [`a = 5*something ? 5- 4 : 6^3`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 4, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 5, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 6, 9],
        matches: [`something`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 16, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 16, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 18, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 19, 1],
        matches: [`-`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 21, 1],
        matches: [`4`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 23, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 23, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 25, 1],
        matches: [`6`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 26, 1],
        matches: [`^`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 27, 1],
        matches: [`3`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 28, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] multi-line ternary 1`, () => {
    // test code to extract tokens from
    const code = [`a = _myvar $`, `  ? 'jello' : "jelly"`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 4, 6],
        matches: [`_myvar`],
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
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [1, 2, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [1, 4, 7],
        matches: [`'jello'`, `jello`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [1, 12, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [1, 14, 7],
        matches: [`"jelly"`, `jelly`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [1, 21, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [1, 21, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 21, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] multi-line ternary 2`, () => {
    // test code to extract tokens from
    const code = [
      `a = myfunc( $`,
      `  a,b,c)  ? b4d  $`,
      `  : $`,
      `  s1nt4x3x4mple`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 4, 7],
        matches: [`myfunc(`, `myfunc`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 12, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 13, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 2, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 3, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 4, 1],
        matches: [`b`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 5, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 6, 1],
        matches: [`c`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [1, 7, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [1, 10, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 12, 3],
        matches: [`b4d`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 17, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 18, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [2, 2, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [2, 4, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [2, 5, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [3, 2, 13],
        matches: [`s1nt4x3x4mple`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [3, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [3, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [3, 15, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] ternary works in braces as expected`, () => {
    // test code to extract tokens from
    const code = [`_17 = arr[!true ? 0 : -3: -1]`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 3],
        matches: [`_17`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 4, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 6, 3],
        matches: [`arr`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 9, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 10, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 16, 1],
        matches: [`?`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 18, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 20, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 22, 1],
        matches: [`-`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 23, 1],
        matches: [`3`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
        pos: [0, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_TERNARY_THEN,
        pos: [0, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COLON,
        pos: [0, 24, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 26, 1],
        matches: [`-`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 27, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 28, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 29, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
