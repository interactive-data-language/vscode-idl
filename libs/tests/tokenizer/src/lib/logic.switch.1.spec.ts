import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates switch statement`, () => {
  it(`[auto generated] parses switch loop with many syntaxes`, () => {
    // test code to extract tokens from
    const code = [
      `SWITCH x OF`,
      `   ; something cool`,
      `1 $`,
      `  : $`,
      `   PRINT, 'one' + func()`,
      `ELSE: BEGIN`,
      `   dat = {myStruct}`,
      `   PRINT, 'Please enter a value between 1 and 4'`,
      `   END`,
      `ENDSWITCH`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_SWITCH,
        pos: [0, 0, 6],
        matches: [`SWITCH`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 1],
        matches: [`x`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [0, 9, 2],
        matches: [`OF`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [1, 3, 16],
        matches: [`; something cool`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [2, 0, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [2, 2, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [2, 3, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [3, 2, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [3, 4, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [3, 5, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [4, 3, 5],
        matches: [`PRINT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [4, 8, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [4, 10, 5],
        matches: [`'one'`, `one`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [4, 16, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [4, 18, 5],
        matches: [`func(`, `func`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [4, 23, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [4, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [4, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [4, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [5, 0, 5],
        matches: [`ELSE:`, `ELSE`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [5, 6, 5],
        matches: [`BEGIN`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [6, 3, 3],
        matches: [`dat`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [6, 7, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [6, 9, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [6, 10, 8],
        matches: [`myStruct`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [6, 18, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [6, 18, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [6, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [7, 3, 5],
        matches: [`PRINT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [7, 8, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [7, 10, 38],
        matches: [
          `'Please enter a value between 1 and 4'`,
          `Please enter a value between 1 and 4`,
        ],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [7, 48, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [8, 3, 3],
        matches: [`END`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [8, 6, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [9, 0, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_SWITCH,
        pos: [9, 0, 9],
        matches: [`ENDSWITCH`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] nested switch statement`, () => {
    // test code to extract tokens from
    const code = [
      `SWITCH x OF`,
      `1: PRINT, 'one'`,
      `ELSE: BEGIN`,
      `  SWITCH x OF`,
      `    2: PRINT, 'two'`,
      `    ELSE: BEGIN`,
      `    END`,
      `  ENDSWITCH`,
      `END`,
      `ENDSWITCH`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_SWITCH,
        pos: [0, 0, 6],
        matches: [`SWITCH`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 1],
        matches: [`x`],
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
        pos: [1, 0, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [1, 1, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [1, 3, 5],
        matches: [`PRINT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 8, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [1, 10, 5],
        matches: [`'one'`, `one`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [1, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [1, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [2, 0, 5],
        matches: [`ELSE:`, `ELSE`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [2, 6, 5],
        matches: [`BEGIN`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_SWITCH,
        pos: [3, 2, 6],
        matches: [`SWITCH`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [3, 9, 1],
        matches: [`x`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [3, 11, 2],
        matches: [`OF`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [4, 4, 1],
        matches: [`2`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [4, 5, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [4, 7, 5],
        matches: [`PRINT`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [4, 12, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [4, 14, 5],
        matches: [`'two'`, `two`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [4, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [4, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [5, 4, 5],
        matches: [`ELSE:`, `ELSE`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [5, 10, 5],
        matches: [`BEGIN`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [6, 4, 3],
        matches: [`END`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [6, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [7, 2, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_SWITCH,
        pos: [7, 2, 9],
        matches: [`ENDSWITCH`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [8, 0, 3],
        matches: [`END`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [8, 3, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [9, 0, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_SWITCH,
        pos: [9, 0, 9],
        matches: [`ENDSWITCH`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
