import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates block parsing auto-closes`, () => {
  it(`[auto generated] lib example from kruskal_wallis.pro`, () => {
    // test code to extract tokens from
    const code = [
      ``,
      `if !true then     $`,
      ``,
      `while !true DO BEGIN`,
      `  a = 42 `,
      `ENDWHILE $`,
      ``,
      `ELSE  stop = stop+1`,
      `end`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [1, 0, 2],
        matches: [`if`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [1, 3, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [1, 9, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 18, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [1, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [3, 0, 5],
        matches: [`while`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.SYSTEM_VARIABLE,
        pos: [3, 6, 5],
        matches: [`!true`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [3, 12, 2],
        matches: [`DO`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BLOCK,
        pos: [3, 15, 5],
        matches: [`BEGIN`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [4, 2, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [4, 4, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [4, 6, 2],
        matches: [`42`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [4, 9, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BLOCK,
        pos: [5, 0, 8],
        matches: [`ENDWHILE`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [5, 9, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_WHILE,
        pos: [5, 9, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [5, 9, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [5, 10, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [7, 0, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [7, 0, 4],
        matches: [`ELSE`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [7, 6, 4],
        matches: [`stop`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [7, 11, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [7, 13, 4],
        matches: [`stop`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [7, 17, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [7, 18, 1],
        matches: [`1`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [7, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [7, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [7, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [7, 19, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.MAIN_LEVEL_END,
        pos: [8, 0, 3],
        matches: [`end`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
