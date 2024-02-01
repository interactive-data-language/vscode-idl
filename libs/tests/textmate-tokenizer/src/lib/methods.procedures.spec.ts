import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates procedure method parsing`, () => {
  it(`[auto generated] parses procedure methods with dots`, async () => {
    // test code to extract tokens from
    const code = [`a.myProc, 1`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myProc',
        startIndex: 2,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'constant.numeric.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses procedure methods with arrows`, async () => {
    // test code to extract tokens from
    const code = [`a->myProc, a`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '->',
        startIndex: 1,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myProc',
        startIndex: 3,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses super procedure methods with dots`, async () => {
    // test code to extract tokens from
    const code = [`a.super::myProc, 1`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'super::myProc',
        startIndex: 2,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'constant.numeric.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses super procedure methods with arrows`, async () => {
    // test code to extract tokens from
    const code = [`a->super::myProc, a`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '->',
        startIndex: 1,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'super::myProc',
        startIndex: 3,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses procedure methods with dots and line continuations`, async () => {
    // test code to extract tokens from
    const code = [`a.myProc, $`, `  1`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myProc',
        startIndex: 2,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '1',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'constant.numeric.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedure method from IDL lib`, async () => {
    // test code to extract tokens from
    const code = [
      `((*state).markers).Add, CGRAD_NEW_MARKER(POSITION=marker['position'], $`,
      `                                         COLOR=color, $`,
      `                                         MIDDLE=marker['middle'])`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '(',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'group.brackets.paren.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: 'state',
        startIndex: 3,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'group.brackets.paren.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 9,
        endIndex: 10,
        scopes: ['source.idl', 'group.brackets.paren.idl'],
      },
      {
        line: 0,
        match: 'markers',
        startIndex: 10,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'Add',
        startIndex: 19,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'CGRAD_NEW_MARKER',
        startIndex: 24,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 40,
        endIndex: 41,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'POSITION',
        startIndex: 41,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 49,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'marker',
        startIndex: 50,
        endIndex: 56,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '[',
        startIndex: 56,
        endIndex: 57,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 57,
        endIndex: 58,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'position',
        startIndex: 58,
        endIndex: 66,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 66,
        endIndex: 67,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 67,
        endIndex: 68,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 68,
        endIndex: 69,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 70,
        endIndex: 71,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'COLOR',
        startIndex: 41,
        endIndex: 46,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 1,
        match: '=',
        startIndex: 46,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'color',
        startIndex: 47,
        endIndex: 52,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 52,
        endIndex: 53,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 54,
        endIndex: 55,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'MIDDLE',
        startIndex: 41,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 2,
        match: '=',
        startIndex: 47,
        endIndex: 48,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'marker',
        startIndex: 48,
        endIndex: 54,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: '[',
        startIndex: 54,
        endIndex: 55,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 55,
        endIndex: 56,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: 'middle',
        startIndex: 56,
        endIndex: 62,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 62,
        endIndex: 63,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: ']',
        startIndex: 63,
        endIndex: 64,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 2,
        match: ')',
        startIndex: 64,
        endIndex: 65,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] single-character procedure method`, async () => {
    // test code to extract tokens from
    const code = [`a.b`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
