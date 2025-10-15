import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  Tokenizer,
  TokenName,
} from '@idl/tokenizer';
import { TOKEN_TYPES } from '@idl/tokenizer/common';

describe(`[auto generated] Validates case statement`, () => {
  it(`[auto generated] parses case loop with many syntaxes`, () => {
    // test code to extract tokens from
    const code = [
      `CASE x OF`,
      `   ; something cool`,
      `1 $`,
      `  : $`,
      `   PRINT, 'one' + func()`,
      `ELSE: BEGIN`,
      `   dat = {myStruct}`,
      `   PRINT, 'Please enter a value between 1 and 4'`,
      `   END`,
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
        pos: [0, 5, 1],
        matches: [`x`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [0, 7, 2],
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
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [9, 0, 7],
        matches: [`ENDCASE`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] nested case statement`, () => {
    // test code to extract tokens from
    const code = [
      `CASE x OF`,
      `1: PRINT, 'one'`,
      `ELSE: BEGIN`,
      `  CASE x OF`,
      `    2: PRINT, 'two'`,
      `    ELSE: BEGIN`,
      `    END`,
      `  ENDCASE`,
      `END`,
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
        pos: [0, 5, 1],
        matches: [`x`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [0, 7, 2],
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
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [3, 2, 4],
        matches: [`CASE`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [3, 7, 1],
        matches: [`x`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [3, 9, 2],
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
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [7, 2, 7],
        matches: [`ENDCASE`],
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
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [9, 0, 7],
        matches: [`ENDCASE`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] methods in case logic`, () => {
    // test code to extract tokens from
    const code = [
      `;+`,
      `; :Returns: Long`,
      `;`,
      `;-`,
      `function Class::Test`,
      `  compile_opt idl2`,
      ``,
      `  case (!true) of`,
      `    self.segnames.pix_latlon: (*self.scan_info_ptr).SetProperty, geo_file = outname`,
      `    self.segnames.pix_latlon: (*self.scan_info_ptr).SetProperty(eo_file = outname)`,
      `    else:`,
      `  endcase`,
      ``,
      `  return, 1`,
      `end`,
      ``,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [0, 0, 2],
        matches: [`;+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [1, 0, 16],
        matches: [`; :Returns: Long`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [2, 0, 1],
        matches: [`;`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [3, 0, 2],
        matches: [`;-`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_FUNCTION,
        pos: [4, 0, 9],
        matches: [`function `, `function`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ROUTINE_METHOD_NAME,
        pos: [4, 9, 11],
        matches: [`Class::Test`, `Class`, `Test`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_METHOD_NAME,
        pos: [4, 20, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [5, 2, 11],
        matches: [`compile_opt`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [5, 14, 4],
        matches: [`idl2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [5, 18, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [7, 2, 4],
        matches: [`case`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [7, 7, 1],
        matches: [`(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [7, 8, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [7, 13, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [7, 15, 2],
        matches: [`of`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [8, 4, 4],
        matches: [`self`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.ACCESS_PROPERTY,
        pos: [8, 8, 9],
        matches: [`.segnames`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.ACCESS_PROPERTY,
        pos: [8, 17, 11],
        matches: [`.pix_latlon`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [8, 28, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [8, 30, 1],
        matches: [`(`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [8, 31, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [8, 32, 4],
        matches: [`self`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.ACCESS_PROPERTY,
        pos: [8, 36, 14],
        matches: [`.scan_info_ptr`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [8, 50, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [8, 50, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE_METHOD,
        pos: [8, 51, 12],
        matches: [`.SetProperty`, `.`, `SetProperty`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [8, 63, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [8, 65, 8],
        matches: [`geo_file`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [8, 74, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [8, 76, 7],
        matches: [`outname`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [8, 83, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE_METHOD,
        pos: [8, 83, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [8, 83, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [9, 4, 4],
        matches: [`self`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.ACCESS_PROPERTY,
        pos: [9, 8, 9],
        matches: [`.segnames`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.ACCESS_PROPERTY,
        pos: [9, 17, 11],
        matches: [`.pix_latlon`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [9, 28, 1],
        matches: [`:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [9, 30, 1],
        matches: [`(`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [9, 31, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [9, 32, 4],
        matches: [`self`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.ACCESS_PROPERTY,
        pos: [9, 36, 14],
        matches: [`.scan_info_ptr`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [9, 50, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.PARENTHESES,
        pos: [9, 50, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
        pos: [9, 51, 13],
        matches: [`.SetProperty(`, `.`, `SetProperty`, `(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [9, 64, 7],
        matches: [`eo_file`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [9, 72, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [9, 74, 7],
        matches: [`outname`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [9, 81, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
        pos: [9, 81, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
        pos: [9, 82, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [10, 4, 5],
        matches: [`else:`, `else`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
        pos: [10, 9, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [11, 2, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [11, 2, 7],
        matches: [`endcase`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [13, 2, 6],
        matches: [`return`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [13, 8, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [13, 10, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [13, 11, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ROUTINE_FUNCTION,
        pos: [14, 0, 3],
        matches: [`end`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
