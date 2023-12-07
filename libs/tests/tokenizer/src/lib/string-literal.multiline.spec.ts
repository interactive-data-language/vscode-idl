import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Verify string literal processing with multi-line statements`, () => {
  it(`[auto generated] preserve spacing and handle multi-line string literals`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `; thing`,
      `a = \` first`,
      `    second`,
      `  third`,
      `last\``,
      `end`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [0, 0, 11],
        matches: [`compile_opt`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 12, 4],
        matches: [`idl2`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CONTROL_COMPILE_OPT,
        pos: [0, 16, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMENT,
        pos: [1, 0, 7],
        matches: [`; thing`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [2, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [2, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [2, 5, 6],
        matches: [` first`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [3, 0, 10],
        matches: [`    second`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [4, 0, 7],
        matches: [`  third`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [5, 0, 4],
        matches: [`last`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [5, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [5, 5, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.MAIN_LEVEL_END,
        pos: [6, 0, 3],
        matches: [`end`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
