import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates line modifier (separators)`, () => {
  it(`[auto generated] parses multi-line as single-line`, () => {
    // test code to extract tokens from
    const code = [`a = a + b() & proc & a.procMethod,1 & $`, `a={struct}`];

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
        pos: [0, 4, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 6, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 8, 2],
        matches: [`b(`, `b`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 10, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 12, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 12, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 12, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 14, 4],
        matches: [`proc`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 19, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 21, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE_METHOD,
        pos: [0, 22, 11],
        matches: [`.procMethod`, `.`, `procMethod`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 33, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 34, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE_METHOD,
        pos: [0, 36, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 36, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 36, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 38, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 39, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 1, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [1, 2, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [1, 3, 6],
        matches: [`struct`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [1, 9, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [1, 9, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 10, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [1, 10, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] loops properly stop in line modifier`, () => {
    // test code to extract tokens from
    const code = [
      `proc & for i=0,99 do print, i & while !true do b = awesome() & foreach val, b, key do print, key, val & endedit`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 0, 4],
        matches: [`proc`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 5, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 5, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 7, 3],
        matches: [`for`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 11, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 12, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 13, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 14, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 14, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 15, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 18, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 21, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 26, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 28, 1],
        matches: [`i`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 30, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 32, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 38, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 44, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 47, 1],
        matches: [`b`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 49, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 51, 8],
        matches: [`awesome(`, `awesome`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 59, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 61, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 61, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [0, 61, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 61, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 61, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_FOREACH,
        pos: [0, 63, 7],
        matches: [`foreach`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 71, 3],
        matches: [`val`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 74, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 76, 1],
        matches: [`b`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 77, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 79, 3],
        matches: [`key`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 83, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 86, 5],
        matches: [`print`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 91, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 93, 3],
        matches: [`key`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 96, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 98, 3],
        matches: [`val`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 102, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 102, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOREACH,
        pos: [0, 102, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 102, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 102, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 104, 7],
        matches: [`endedit`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 111, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 111, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] line separators in case statement`, () => {
    // test code to extract tokens from
    const code = [
      `CASE typ OF`,
      `  7: begin val = "<Undefined>" & cnt = 1  & endcase`,
      `  8: val = tiff_sint(val, 0, len=cnt)`,
      `ENDCASE`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [0, 0, 4],
        matches: [`CASE`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 5, 3],
        matches: [`typ`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [0, 9, 2],
        matches: [`OF`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [1, 2, 1],
        matches: [`7`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [1, 3, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [1, 5, 5],
        matches: [`begin`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 11, 3],
        matches: [`val`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 15, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [1, 17, 13],
        matches: [`"<Undefined>"`, `<Undefined>`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 31, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [1, 31, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 33, 3],
        matches: [`cnt`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 37, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [1, 39, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [1, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [1, 42, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [1, 44, 0],
        matches: [``, `endcase`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [1, 44, 7],
        matches: [`endcase`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [1, 51, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [2, 2, 1],
        matches: [`8`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [2, 3, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 5, 3],
        matches: [`val`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 9, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [2, 11, 10],
        matches: [`tiff_sint(`, `tiff_sint`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 21, 3],
        matches: [`val`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [2, 24, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [2, 26, 1],
        matches: [`0`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [2, 27, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 29, 3],
        matches: [`len`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 32, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 33, 3],
        matches: [`cnt`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 36, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [2, 36, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 37, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [2, 37, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [3, 0, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [3, 0, 7],
        matches: [`ENDCASE`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies nested line continuations use basic token`, () => {
    // test code to extract tokens from
    const code = [`scale=scale, $, $`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 5],
        matches: [`scale`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 6, 5],
        matches: [`scale`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 11, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNKNOWN,
        pos: [0, 11, 2],
        matches: [`, `],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 13, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNKNOWN,
        pos: [0, 14, 3],
        matches: [`, $`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 17, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
