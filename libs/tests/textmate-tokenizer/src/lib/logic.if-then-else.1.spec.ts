import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates for if-then-else parsing [1]`, () => {
  it(`[auto generated] parses basic if-then loop`, async () => {
    // test code to extract tokens from
    const code = [`if !true then print, 'yes'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 9,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 14,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'yes',
        startIndex: 22,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic if-then-else loop`, async () => {
    // test code to extract tokens from
    const code = [`if ~doIt then print, 'yes' else a = yellow()`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '~',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'doIt',
        startIndex: 4,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 9,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 14,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'yes',
        startIndex: 22,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'else',
        startIndex: 27,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 32,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 34,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'yellow',
        startIndex: 36,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 42,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 43,
        endIndex: 44,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic if-then loop with line continuation 1`, async () => {
    // test code to extract tokens from
    const code = [`if !true $`, `  then print, 'yes'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'then',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'print',
        startIndex: 7,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: "'",
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: 'yes',
        startIndex: 15,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: "'",
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic if-then loop with line continuation 2`, async () => {
    // test code to extract tokens from
    const code = [`if !true $`, `  then print $`, `  , 'yes'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'then',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'print',
        startIndex: 7,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: 'yes',
        startIndex: 5,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic if-then-else loop with line continuation 1`, async () => {
    // test code to extract tokens from
    const code = [`if !true then print, 'yes' $`, `  else print, 'no'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 9,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 14,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'yes',
        startIndex: 22,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'else',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'print',
        startIndex: 7,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: "'",
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: 'no',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: "'",
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic if-then-else loop with line continuation 2`, async () => {
    // test code to extract tokens from
    const code = [`if !true then print, 'yes' $`, `  else $`, `  print, 'no'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 9,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 14,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'yes',
        startIndex: 22,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'else',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'print',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: 'no',
        startIndex: 10,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] nested if-then-else`, async () => {
    // test code to extract tokens from
    const code = [`if ~(myFunc(_a17$) * 2) then if !false then print, 'yes'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '~',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '(',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'myFunc',
        startIndex: 5,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '_a17$',
        startIndex: 12,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 24,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' if',
        startIndex: 28,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '!false',
        startIndex: 32,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 39,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 44,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 49,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 51,
        endIndex: 52,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'yes',
        startIndex: 52,
        endIndex: 55,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 55,
        endIndex: 56,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
