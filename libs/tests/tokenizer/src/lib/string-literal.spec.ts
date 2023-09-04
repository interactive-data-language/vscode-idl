import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Verify string literal processing`, () => {
  it(`[auto generated] simple with substitution`, () => {
    // test code to extract tokens from
    const code = [`a = \`my string with \${expression + 5}\``];

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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 5, 15],
        matches: [`my string with `],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 20, 2],
        matches: [`\${`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 22, 10],
        matches: [`expression`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 33, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 35, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 36, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 36, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 37, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 38, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] simple without substitution`, () => {
    // test code to extract tokens from
    const code = [`a = \`my string without substitution\``];

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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 5, 30],
        matches: [`my string without substitution`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 35, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 36, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] properly capture nested literals`, () => {
    // test code to extract tokens from
    const code = [`a = \`start \${ \`nested\` }  else\``];

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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 5, 6],
        matches: [`start `],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 11, 2],
        matches: [`\${`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 14, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 15, 6],
        matches: [`nested`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 21, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 23, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 24, 6],
        matches: [`  else`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 30, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 31, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] complex nested case`, () => {
    // test code to extract tokens from
    const code = [
      `a = \`something \${func(a = b, \`nested\`, /kw) + 6*12} else \${5*5 + \`something\` + nested}  some\``,
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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 5, 10],
        matches: [`something `],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 15, 2],
        matches: [`\${`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 17, 5],
        matches: [`func(`, `func`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 22, 1],
        matches: [`a`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 24, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 26, 1],
        matches: [`b`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 27, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 27, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 29, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 30, 6],
        matches: [`nested`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 36, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 37, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 39, 1],
        matches: [`/`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 40, 2],
        matches: [`kw`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 42, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 42, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 44, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 46, 1],
        matches: [`6`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 47, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 48, 2],
        matches: [`12`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 50, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 50, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 50, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 51, 6],
        matches: [` else `],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 57, 2],
        matches: [`\${`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 59, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 60, 1],
        matches: [`*`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 61, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 63, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 65, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 66, 9],
        matches: [`something`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 75, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 77, 1],
        matches: [`+`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 79, 6],
        matches: [`nested`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 85, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 85, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 85, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 85, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 86, 6],
        matches: [`  some`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 92, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 93, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parse escaped backticks`, () => {
    // test code to extract tokens from
    const code = [`a = \`something \\\` included  \``];

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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 5, 10],
        matches: [`something `],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
        pos: [0, 15, 2],
        matches: [`\\\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 17, 11],
        matches: [` included  `],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 28, 1],
        matches: [`\``],
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

  it(`[auto generated] preserve spacing when extracting tokens`, () => {
    // test code to extract tokens from
    const code = [`a = \` first \``];

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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRING_TEMPLATE_STRING,
        pos: [0, 5, 7],
        matches: [` first `],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 12, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 13, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] template literal string with formatting`, () => {
    // test code to extract tokens from
    const code = [`a = \`\${1.234,"%10.3f"}\``];

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
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 4, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 5, 2],
        matches: [`\${`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 7, 5],
        matches: [`1.234`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 12, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 13, 8],
        matches: [`"%10.3f"`, `%10.3f`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
        pos: [0, 21, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
        pos: [0, 22, 1],
        matches: [`\``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 23, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
