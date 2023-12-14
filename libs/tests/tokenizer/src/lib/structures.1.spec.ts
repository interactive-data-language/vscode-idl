import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates structure parsing`, () => {
  it(`[auto generated] verifies simplest structure parsing`, () => {
    // test code to extract tokens from
    const code = [`_z5$ = {thing}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_z5$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 7, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [0, 8, 5],
        matches: [`thing`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [0, 13, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 13, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 14, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies multi-line structure name parsing`, () => {
    // test code to extract tokens from
    const code = [`_17$ = { $`, `  thing}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_17$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 7, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 9, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 10, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [1, 2, 5],
        matches: [`thing`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [1, 7, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [1, 7, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [1, 8, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies simplest property parsing without structure name`, () => {
    // test code to extract tokens from
    const code = [`_17$ = {thing:z}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_17$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 7, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 8, 6],
        matches: [`thing:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 14, 1],
        matches: [`z`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 15, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 15, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 16, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies simplest property parsing without structure name and line continuation`, () => {
    // test code to extract tokens from
    const code = [`_17$ = { $`, `  thing:z}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_17$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 7, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 9, 1],
        matches: [`$`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.LINE_CONTINUATION,
        pos: [0, 10, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [1, 2, 6],
        matches: [`thing:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [1, 8, 1],
        matches: [`z`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
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
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies simplest nested structure parsing`, () => {
    // test code to extract tokens from
    const code = [`_z5$ = {thing1:{thing2:z}}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_z5$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 7, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 8, 7],
        matches: [`thing1:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 15, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 16, 7],
        matches: [`thing2:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 23, 1],
        matches: [`z`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 24, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 24, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 25, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 25, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 26, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });

  it(`[auto generated] verifies structure with inheritance`, () => {
    // test code to extract tokens from
    const code = [`_z5$ = {thing, inherits _jklol}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 4],
        matches: [`_z5$`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 5, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 7, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [0, 8, 5],
        matches: [`thing`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 13, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.STRUCTURE_INHERITANCE,
        pos: [0, 15, 15],
        matches: [`inherits _jklol`, `_jklol`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [0, 30, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 30, 1],
        matches: [`}`],
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

  it(`[auto generated] verifies all components in single-line`, () => {
    // test code to extract tokens from
    const code = [`a17 = {_th1g, abc:def, b:5, c:f()}`];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 0, 3],
        matches: [`a17`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 4, 1],
        matches: [`=`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 6, 1],
        matches: [`{`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [0, 7, 5],
        matches: [`_th1g`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 12, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 14, 4],
        matches: [`abc:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.VARIABLE,
        pos: [0, 18, 3],
        matches: [`def`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 21, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 21, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 23, 2],
        matches: [`b:`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.NUMBER,
        pos: [0, 25, 1],
        matches: [`5`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 26, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.COMMA,
        pos: [0, 26, 1],
        matches: [`,`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 28, 2],
        matches: [`c:`],
      },
      {
        type: TOKEN_TYPES.START,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 30, 2],
        matches: [`f(`, `f`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.CALL_FUNCTION,
        pos: [0, 32, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_PROPERTY,
        pos: [0, 33, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE_NAME,
        pos: [0, 33, 0],
        matches: [``],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.STRUCTURE,
        pos: [0, 33, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.END,
        name: TOKEN_NAMES.ASSIGNMENT,
        pos: [0, 34, 0],
        matches: [``],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
