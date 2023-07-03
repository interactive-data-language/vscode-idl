import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates routine parsing`, () => {
  it(`[auto generated] verifies procedure with arguments and keywords`, async () => {
    // test code to extract tokens from
    const code = [
      `PRO EndMagic, arg1, $ ; comment`,
      `  arg2, KW1 = $`,
      `  kw1, KW2 = kw2`,
      ``,
      `END`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'PRO',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'EndMagic',
        startIndex: 4,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'arg1',
        startIndex: 14,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '; comment',
        startIndex: 22,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 1,
        match: 'arg2',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 1,
        match: ', ',
        startIndex: 6,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 1,
        match: 'KW1',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 1,
        match: '= ',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'kw1',
        startIndex: 2,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 2,
        match: ', ',
        startIndex: 5,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 2,
        match: 'KW2',
        startIndex: 7,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 2,
        match: ' = ',
        startIndex: 10,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'kw2',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 4,
        match: 'END',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies functions with arguments and keywords`, async () => {
    // test code to extract tokens from
    const code = [
      `function myfunc, arg1, $ ; comment`,
      `  arg2, KW1 = $`,
      `  kw1, KW2 = kw2`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'function',
        startIndex: 0,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'myfunc',
        startIndex: 9,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'arg1',
        startIndex: 17,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 21,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '; comment',
        startIndex: 25,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 1,
        match: 'arg2',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 1,
        match: ', ',
        startIndex: 6,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 1,
        match: 'KW1',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 1,
        match: '= ',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'kw1',
        startIndex: 2,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 2,
        match: ', ',
        startIndex: 5,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 2,
        match: 'KW2',
        startIndex: 7,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 2,
        match: ' = ',
        startIndex: 10,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'kw2',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 4,
        match: 'end',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies procedure method with arguments and keywords`, async () => {
    // test code to extract tokens from
    const code = [
      `PRO myclass::mymethod, arg1, $ ; comment`,
      `  ; skip empty lines`,
      `  arg2, KW1 = $`,
      `  kw1, KW2 = kw2`,
      ``,
      `END`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'PRO',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'myclass::mymethod',
        startIndex: 4,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 21,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'arg1',
        startIndex: 23,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 27,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '; comment',
        startIndex: 31,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 1,
        match: '; skip empty lines',
        startIndex: 2,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'group.empty.line.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 2,
        match: 'arg2',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 2,
        match: ', ',
        startIndex: 6,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 2,
        match: 'KW1',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 2,
        match: '= ',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 2,
        match: '$',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 3,
        match: 'kw1',
        startIndex: 2,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 3,
        match: ', ',
        startIndex: 5,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 3,
        match: 'KW2',
        startIndex: 7,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 3,
        match: ' = ',
        startIndex: 10,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 3,
        match: 'kw2',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 5,
        match: 'END',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies function method with arguments and keywords`, async () => {
    // test code to extract tokens from
    const code = [
      `function myfuncclass::mymethod, arg1, $ ; comment`,
      ``,
      `  arg2, KW1 = $`,
      ``,
      `  kw1, KW2 = kw2`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'function',
        startIndex: 0,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'myfuncclass::mymethod',
        startIndex: 9,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'entity.name.function.idl-method',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 30,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'arg1',
        startIndex: 32,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 36,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 38,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '; comment',
        startIndex: 40,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 2,
        match: 'arg2',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 2,
        match: ', ',
        startIndex: 6,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 2,
        match: 'KW1',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 2,
        match: '= ',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 2,
        match: '$',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 4,
        match: 'kw1',
        startIndex: 2,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 4,
        match: ', ',
        startIndex: 5,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 4,
        match: 'KW2',
        startIndex: 7,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 4,
        match: ' = ',
        startIndex: 10,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'parameter.definition.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 4,
        match: 'kw2',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 6,
        match: 'end',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies more than one routine`, async () => {
    // test code to extract tokens from
    const code = [
      `Function f1`,
      `  return, 5`,
      `end`,
      ``,
      `pro p1`,
      `  print, 42`,
      `end`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'Function',
        startIndex: 0,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'f1',
        startIndex: 9,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 1,
        match: 'return',
        startIndex: 2,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '5',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 2,
        match: 'end',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 4,
        match: 'pro',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 4,
        match: 'p1',
        startIndex: 4,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 5,
        match: 'print',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 5,
        match: ',',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 5,
        match: '42',
        startIndex: 9,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 6,
        match: 'end',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
