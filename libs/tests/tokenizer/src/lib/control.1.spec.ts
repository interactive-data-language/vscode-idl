import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates control statement parsing`, () => {
  it(`[auto generated] parses basic control statements`, () => {
    // test code to extract tokens from
    const code = [
      `break`,
      `continue`,
      `jump: a = func()`,
      `jump: mypro, $`,
      `  5`,
      `jumpy17$: ;comment`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_BREAK,
        pos: [0, 0, 5],
        matches: [`break`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_CONTINUE,
        pos: [1, 0, 8],
        matches: [`continue`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_JUMP,
        pos: [2, 0, 5],
        matches: [`jump:`, `:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 6, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 8, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [2, 10, 5],
        matches: [`func(`, `func`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [2, 15, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 16, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_JUMP,
        pos: [3, 0, 5],
        matches: [`jump:`, `:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [3, 6, 5],
        matches: [`mypro`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [3, 11, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [3, 13, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [3, 14, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [4, 2, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [4, 3, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_JUMP,
        pos: [5, 0, 9],
        matches: [`jumpy17$:`, `:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [5, 10, 8],
        matches: [`;comment`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses break in if statements`, () => {
    // test code to extract tokens from
    const code = [`if !true then break`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 0, 2],
        matches: [`if`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 3, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 9, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_BREAK,
        pos: [0, 14, 5],
        matches: [`break`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 19, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses continue in if statements`, () => {
    // test code to extract tokens from
    const code = [`if !true then continue`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 0, 2],
        matches: [`if`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [0, 3, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 9, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_CONTINUE,
        pos: [0, 14, 8],
        matches: [`continue`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 22, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 22, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses continue and break in loops`, () => {
    // test code to extract tokens from
    const code = [`for i=0,99 do begin`, `  continue`, `  break`, `endfor`];

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
        pos: [0, 8, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 11, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [0, 14, 5],
        matches: [`begin`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_CONTINUE,
        pos: [1, 2, 8],
        matches: [`continue`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_BREAK,
        pos: [2, 2, 5],
        matches: [`break`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [3, 0, 6],
        matches: [`endfor`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [3, 6, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [3, 6, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses jump in blocks`, () => {
    // test code to extract tokens from
    const code = [`for i=0,99 do begin`, `  jump:`, `endfor`];

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
        pos: [0, 8, 2],
        matches: [`99`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 11, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [0, 14, 5],
        matches: [`begin`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.CONTROL_JUMP,
        pos: [1, 2, 5],
        matches: [`jump:`, `:`],
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

  it(`[auto generated] parses compound control statements`, () => {
    // test code to extract tokens from
    const code = [
      `common, group, var1, var2, var3 ; comment`,
      `compile_opt, idl2, $ ; line continuation`,
      `  hidden`,
      `compile_opt`,
      `forward_function, idl2, hidden`,
      `goto, label`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_COMMON,
        pos: [0, 0, 6],
        matches: [`common`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 6, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 8, 5],
        matches: [`group`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 13, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 15, 4],
        matches: [`var1`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 19, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 21, 4],
        matches: [`var2`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 25, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 27, 4],
        matches: [`var3`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_COMMON,
        pos: [0, 32, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [0, 32, 9],
        matches: [`; comment`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [1, 0, 11],
        matches: [`compile_opt`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 11, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 13, 4],
        matches: [`idl2`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [1, 17, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 19, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [1, 21, 19],
        matches: [`; line continuation`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 40, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 2, 6],
        matches: [`hidden`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [2, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [3, 0, 11],
        matches: [`compile_opt`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [3, 11, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_FORWARD_FUNCTION,
        pos: [4, 0, 16],
        matches: [`forward_function`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [4, 16, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [4, 18, 4],
        matches: [`idl2`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [4, 22, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [4, 24, 6],
        matches: [`hidden`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_FORWARD_FUNCTION,
        pos: [4, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_GO_TO,
        pos: [5, 0, 4],
        matches: [`goto`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [5, 4, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [5, 6, 5],
        matches: [`label`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_GO_TO,
        pos: [5, 11, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] goto in in statement`, () => {
    // test code to extract tokens from
    const code = [`if not wild then goto, done else printf, outunit`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 0, 2],
        matches: [`if`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 3, 3],
        matches: [`not`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 7, 4],
        matches: [`wild`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR_LOGICAL,
        pos: [0, 12, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 12, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_GO_TO,
        pos: [0, 17, 4],
        matches: [`goto`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 21, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 23, 4],
        matches: [`done`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_GO_TO,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 28, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [0, 28, 4],
        matches: [`else`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 33, 6],
        matches: [`printf`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 39, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 41, 7],
        matches: [`outunit`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_PROCEDURE,
        pos: [0, 48, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [0, 48, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 48, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] statements end at line separator`, () => {
    // test code to extract tokens from
    const code = [`GOTO, do_six & END`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_GO_TO,
        pos: [0, 0, 4],
        matches: [`GOTO`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 4, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 6, 6],
        matches: [`do_six`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_GO_TO,
        pos: [0, 13, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 13, 1],
        matches: [`&`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_SEPARATION,
        pos: [0, 15, 0],
        matches: [``, `END`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.MAIN_LEVEL_END,
        pos: [0, 15, 3],
        matches: [`END`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
