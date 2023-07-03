import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Verify string literal escape characters`, () => {
  it(`[auto generated] for syntax highlighting`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `a = \`\\\`\``,
      `a = \`\\$\``,
      `a = \`\\\\\``,
      `a = \`\\b\``,
      `a = \`\\f\``,
      `a = \`\\n\``,
      `a = \`\\r\``,
      `a = \`\\t\``,
      `a = \`\\v\``,
      `a = \`\\x00 \\XaF\``,
      `a = \`\\a \``,
      `end`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code);

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
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [1, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [1, 5, 2],
        matches: [`\\\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [1, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 8, 0],
        matches: [``],
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
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [2, 5, 2],
        matches: [`\\$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [2, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [2, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [3, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [3, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [3, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [3, 5, 2],
        matches: [`\\\\`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [3, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [3, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [4, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [4, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [4, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [4, 5, 2],
        matches: [`\\b`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [4, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [4, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [5, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [5, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [5, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [5, 5, 2],
        matches: [`\\f`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [5, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [5, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [6, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [6, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [6, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [6, 5, 2],
        matches: [`\\n`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [6, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [6, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [7, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [7, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [7, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [7, 5, 2],
        matches: [`\\r`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [7, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [7, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [8, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [8, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [8, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [8, 5, 2],
        matches: [`\\t`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [8, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [8, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [9, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [9, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [9, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [9, 5, 2],
        matches: [`\\v`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [9, 7, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [9, 8, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [10, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [10, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [10, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [10, 5, 4],
        matches: [`\\x00`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [10, 9, 1],
        matches: [` `],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [10, 10, 4],
        matches: [`\\XaF`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [10, 14, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [10, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [11, 0, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [11, 2, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [11, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [11, 5, 1],
        matches: [`\\`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [11, 6, 2],
        matches: [`a `],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [11, 8, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [11, 9, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.MAIN_LEVEL_END,
        pos: [12, 0, 3],
        matches: [`end`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
