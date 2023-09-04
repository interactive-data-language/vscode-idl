import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates quote parsing`, () => {
  it(`[auto generated] parses standalone single quotes`, () => {
    // test code to extract tokens from
    const code = [`'myFunc(1 + 2)'`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 0, 15],
        matches: [`'myFunc(1 + 2)'`, `myFunc(1 + 2)`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] parses standalone double quotes`, () => {
    // test code to extract tokens from
    const code = [`"myFunc(1 + 2)"`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 0, 15],
        matches: [`"myFunc(1 + 2)"`, `myFunc(1 + 2)`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify single quotes without closing`, () => {
    // test code to extract tokens from
    const code = [`'string`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 0, 7],
        matches: [`'string`, `string`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verify double quotes without closing`, () => {
    // test code to extract tokens from
    const code = [`"string`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 0, 7],
        matches: [`"string`, `string`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] confusing single quote`, () => {
    // test code to extract tokens from
    const code = [
      `hDefinition['schema']).StartsWith('IDLColorGradientDefinition', /FOLD_CASE)`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 11],
        matches: [`hDefinition`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 11, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 12, 8],
        matches: [`'schema'`, `schema`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 20, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [0, 21, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
        pos: [0, 22, 12],
        matches: [`.StartsWith(`, `.`, `StartsWith`, `(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 34, 28],
        matches: [`'IDLColorGradientDefinition'`, `IDLColorGradientDefinition`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 62, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 64, 1],
        matches: [`/`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 65, 9],
        matches: [`FOLD_CASE`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 74, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
        pos: [0, 74, 1],
        matches: [`)`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] confusing double quote`, () => {
    // test code to extract tokens from
    const code = [
      `hDefinition["schema"]).StartsWith("IDLColorGradientDefinition", /FOLD_CASE)`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 11],
        matches: [`hDefinition`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 11, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 12, 8],
        matches: [`"schema"`, `schema`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 20, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [0, 21, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
        pos: [0, 22, 12],
        matches: [`.StartsWith(`, `.`, `StartsWith`, `(`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 34, 28],
        matches: [`"IDLColorGradientDefinition"`, `IDLColorGradientDefinition`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 62, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 64, 1],
        matches: [`/`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 65, 9],
        matches: [`FOLD_CASE`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.OPERATOR,
        pos: [0, 74, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
        pos: [0, 74, 1],
        matches: [`)`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 1`, () => {
    // test code to extract tokens from
    const code = [`if "bad-quote"then "bad-quote"else`];

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
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 3, 11],
        matches: [`"bad-quote"`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 14, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 19, 11],
        matches: [`"bad-quote"`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [0, 30, 4],
        matches: [`else`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [0, 34, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 34, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 2`, () => {
    // test code to extract tokens from
    const code = [`case "bad-quote"of`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [0, 0, 4],
        matches: [`case`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 5, 11],
        matches: [`"bad-quote"`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [0, 16, 2],
        matches: [`of`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 3`, () => {
    // test code to extract tokens from
    const code = [`for "bad-quote"do`];

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
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 4, 11],
        matches: [`"bad-quote"`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 15, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 17, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 17, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 4`, () => {
    // test code to extract tokens from
    const code = [`repeat 'bad-quote'until`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`repeat`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 7, 11],
        matches: [`'bad-quote'`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 18, 5],
        matches: [`until`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 23, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 23, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 5`, () => {
    // test code to extract tokens from
    const code = [`if 'bad-quote'then 'bad-quote'else`];

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
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 3, 11],
        matches: [`'bad-quote'`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 14, 4],
        matches: [`then`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 19, 11],
        matches: [`'bad-quote'`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_THEN,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [0, 30, 4],
        matches: [`else`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_ELSE,
        pos: [0, 34, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOGICAL_IF,
        pos: [0, 34, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 6`, () => {
    // test code to extract tokens from
    const code = [`case 'bad-quote'of`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_CASE,
        pos: [0, 0, 4],
        matches: [`case`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 5, 11],
        matches: [`'bad-quote'`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOGICAL_OF,
        pos: [0, 16, 2],
        matches: [`of`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 7`, () => {
    // test code to extract tokens from
    const code = [`for 'bad-quote'do`];

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
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 4, 11],
        matches: [`'bad-quote'`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 15, 2],
        matches: [`do`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_DO,
        pos: [0, 17, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_FOR,
        pos: [0, 17, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] quotes end at important statements 8`, () => {
    // test code to extract tokens from
    const code = [`repeat 'bad-quote'until`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 0, 6],
        matches: [`repeat`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_SINGLE,
        pos: [0, 7, 11],
        matches: [`'bad-quote'`, `bad-quote`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 18, 5],
        matches: [`until`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_UNTIL,
        pos: [0, 23, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LOOP_REPEAT,
        pos: [0, 23, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies quote vs number is correctly identified`, () => {
    // test code to extract tokens from
    const code = [`arr = ["0.00000000"]`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 3],
        matches: [`arr`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 4, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 6, 1],
        matches: [`[`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.QUOTE_DOUBLE,
        pos: [0, 7, 12],
        matches: [`"0.00000000"`, `0.00000000`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.BRACKET,
        pos: [0, 19, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 20, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
